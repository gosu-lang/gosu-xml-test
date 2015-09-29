package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses java.net.URI
uses gw.xml.XmlException
uses org.junit.Test
uses org.xml.sax.SAXParseException
uses javax.xml.namespace.QName
uses java.io.File

class XmlSchemaDuplicateNamespaceTest extends XSDTest {

  @Test
  function testSchemaThatImportsSchemaWithIdenticalNamespace() {
    var dupNS = new URI( "urn:duplicate" )
    var schema = new Schema()
    schema.TargetNamespace = dupNS
    schema.Import[0].Namespace = dupNS
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "root"

    var schema2 = new Schema()
    schema2.TargetNamespace = dupNS
    schema2.Element[0].Name = "root2"

    try {
      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, new  String[0] )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      assertEquals( SAXParseException, typeof ex.Cause )
      assertTrue(ex.Cause.Message.startsWith("src-import.1.1:"))
    }
  }

  @Test
  function testMultipleImportsWithSameNamespace() {
    var ns1 = new URI ( "urn:ns1" )
    var dupNS = new URI( "urn:duplicate" )
    var schema = new Schema()
    schema.TargetNamespace = ns1
    schema.Import[0].Namespace = dupNS
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[1].Namespace = dupNS
    schema.Import[1].SchemaLocation = new URI( "schema3.xsd" )
    schema.Element[0].Name = "topLevel1"
    schema.Element[0].Type = new QName( dupNS.toString(), "MyType" )

    var schema2 = new Schema()
    schema2.TargetNamespace = dupNS
    schema2.ComplexType[0].Name= "MyType"
    schema2.ComplexType[0].SimpleContent.Extension.Base = schema2.$Namespace.qualify( "int" )

    var schema3 = new Schema()
    schema3.TargetNamespace = dupNS
    schema3.ComplexType[0].Name= "MyType"
    schema3.ComplexType[0].SimpleContent.Extension.Base = schema3.$Namespace.qualify( "QName" )

    // we now allow this
    XmlSchemaTestUtil.runWithResources( {schema, schema2, schema3}, {} as java.lang.String[] )
  }

  @Test
  function testMultipleImportsWithSameNamespaceNegative() {
    var ns1 = new URI ( "urn:ns1" )
    var dupNS = new URI( "urn:duplicate" )
    var schema = new Schema()
    schema.TargetNamespace = ns1
    schema.Import[0].Namespace = dupNS
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[1].Namespace = dupNS
    schema.Import[1].SchemaLocation = new URI( "schema3.xsd" )
    schema.Element[0].Name= "Toplevel1"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( dupNS.toString(), "child2" )
    schema.Element[0].ComplexType.Sequence.Element[1].Ref = new QName( dupNS.toString(), "child3" )

    var schema2 = new Schema()
    schema2.TargetNamespace = dupNS
    schema2.Element[0].Name = "child2"
    schema2.Element[0].Type = schema2.$Namespace.qualify( "int" )

    var schema3 = new Schema()
    schema3.TargetNamespace = dupNS
    schema3.Element[0].Name = "child3"
    schema3.Element[0].Type = schema3.$Namespace.qualify( "int" )

    // we now allow this
    XmlSchemaTestUtil.runWithResources( {schema, schema2, schema3}, new String[0] )
  }

  @Test
  function testMixedImportIncludeWithSameNamespace() {
    var ns1 = new URI( "urn:ns1" )
    var dupNS = new URI( "urn:duplicate" )

    var schema = new Schema()
    schema.TargetNamespace = ns1
    schema.Import[0].Namespace = dupNS
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Include[0].SchemaLocation = new URI( "schema3.xsd" )

    schema.Element[0].Name = "root1"
    schema.Element[0].Type = new QName( dupNS.toString(), "MyType")

    var schema2 = new Schema()
    schema2.TargetNamespace = dupNS
    schema2.Include[0].SchemaLocation = new URI( "schema4.xsd" )

    var schema3 = new Schema()
    schema3.Import[0].Namespace = dupNS
    schema3.Import[0].SchemaLocation = new URI( "schema5.xsd" )

    var schema4 = new Schema()
    schema4.TargetNamespace = dupNS
    schema4.ComplexType[0].Name= "MyType"
    schema4.ComplexType[0].SimpleContent.Extension.Base = schema4.$Namespace.qualify( "int" )

    var schema5 = new Schema()
    schema5.TargetNamespace = dupNS
    schema5.ComplexType[0].Name= "MyType2"
    schema5.ComplexType[0].SimpleContent.Extension.Base = schema4.$Namespace.qualify( "QName" )

    XmlSchemaTestUtil.runWithResources( {schema, schema2, schema3, schema4, schema5}, {
        "var xml = new $$TESTPACKAGE$$.schema.Root1()",
        "assertEquals( java.lang.Integer, statictypeof xml.$Value )"
    } )
  }

  @Test
  function testMixedImportIncludeWithSameNamespaceNegative() {
    var ns1 = new URI( "urn:ns1" )
    var dupNS = new URI( "urn:duplicate" )

    var schema = new Schema()
    schema.TargetNamespace = ns1
    schema.Import[0].Namespace = dupNS
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Include[0].SchemaLocation = new URI( "schema3.xsd" )

    schema.Element[0].Name = "root1"
    schema.Element[0].Type = new QName( dupNS.toString(), "MyType")
    schema.Element[0].Name = "root2"
    schema.Element[0].Type = new QName( dupNS.toString(), "MyType2")

    var schema2 = new Schema()
    schema2.TargetNamespace = dupNS
    schema2.Include[0].SchemaLocation = new URI( "schema4.xsd" )

    var schema3 = new Schema()
    schema3.Import[0].Namespace = dupNS
    schema3.Import[0].SchemaLocation = new URI( "schema5.xsd" )

    var schema4 = new Schema()
    schema4.TargetNamespace = dupNS
    schema4.ComplexType[0].Name= "MyType"
    schema4.ComplexType[0].SimpleContent.Extension.Base = schema4.$Namespace.qualify( "int" )

    var schema5 = new Schema()
    schema5.TargetNamespace = dupNS
    schema5.ComplexType[0].Name= "MyType2"
    schema5.ComplexType[0].SimpleContent.Extension.Base = schema4.$Namespace.qualify( "QName" )

    XmlSchemaTestUtil.runWithResources( {schema, schema2, schema3, schema4, schema5}, new String[0] )
  }

  @Test
  function testPL19758() {
    var tempFile = File.createTempFile( "pl19758", ".xml" )
    try {
//      var xmlString =
//          "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ping=\"http://schema.amfam.com/ping\">\n" +
//              "   <soapenv:Header/>\n" +
//              "   <soapenv:Body>\n" +
//              "      <ping:pingResponse>\n" +
//              "         <ping:PingResult>\n" +
//              "            <ping:Status>Success</ping:Status>\n" +
//              "            <ping:message>Ping Successful: VersionInfo-2.0.33|SchemaInfo-orad0017-CDH_DEV6_ORS</ping:message>\n" +
//              "            <!--Zero or more repetitions:-->\n" +
//              "            <ping:Verification>\n" +
//              "               <ping:componentName>CDH</ping:componentName>\n" +
//              "               <ping:Status>Success</ping:Status>\n" +
//              "               <ping:message>CDH was pinged successfully.</ping:message>\n" +
//              "               <ping:timeTakenForComponentVerification>62ms</ping:timeTakenForComponentVerification>\n" +
//              "            </ping:Verification>\n" +
//              "            <ping:timeTakenForPing>62ms</ping:timeTakenForPing>\n" +
//              "         </ping:PingResult>\n" +
//              "      </ping:pingResponse>\n" +
//              "   </soapenv:Body>\n" +
//              "</soapenv:Envelope>"
//      xmlString.writeTo( tempFile )
//      var ws = new gw.xml.xsd.typeprovider.pl19758.partysearchservice.PartySearchService()
//      ws.Config.ServerOverrideUrl = tempFile.toURI()
//      ws.Config.XmlSerializationOptions.Validate = false
//      ws.Config.XmlSerializationOptions.Sort = false
//      ws.ping( new() ).print()
    }
    finally {
      tempFile.delete()
    }
  }

  @Test
  function testSchemaWithDuplicateElementInIncludedSchema() {
    var schema = new Schema()
    schema.Include[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )
    var schema2 = new Schema()
    schema2.Element[0].Name = "root"
    schema2.Element[0].Type = schema.$Namespace.qualify( "int" )
    // we now allow duplicates - they are removed before sending to Xerces - this simplifies a lot of things
    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = 5",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.$Value )"
    } )
  }

//  function testJira_PL22177() {
//    var xml = new gw.xml.xsd.typeprovider.pl22177.searchlocation.SearchLocationRs()
//    xml.Location.SearchAddress[0].Search.MaxResponseNo = 5
//    xml = xml.parse( xml.bytes() )
//    assertEquals( 5 as BigInteger, xml.Location.SearchAddress[0].Search.MaxResponseNo )
//  }

}