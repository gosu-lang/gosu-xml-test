package gw.xml.xsd.typeprovider

uses java.net.URI
uses javax.xml.namespace.QName
uses java.io.ByteArrayOutputStream
uses gw.xsd.w3c.xmlschema.Schema
uses gw.lang.reflect.interval.ISequenceable
uses org.junit.Ignore
uses org.junit.Test

class XmlSchemaSchemaTest extends XSDTest {

  @Test
  @Ignore("WSDL Test?")
  function testAlternateSchemaSchemaCanBeLoaded() {

    var schemaSchema = gw.xsd.w3c.xmlschema.util.SchemaAccess.Schema
    schemaSchema.Import.where( \ import -> import.Namespace == new URI( "http://www.w3.org/XML/1998/namespace" ) )[0].SchemaLocation = new URI( "schema2.xsd" )
    XmlSchemaTestUtil.runWithResources( { schemaSchema, gw.xsd.w3c.xml.util.SchemaAccess.Schema }, {
        "var xml = new $$TESTPACKAGE$$.schema.Schema()",
        "xml.Element[0].Name = \"Root\"",
        "xml.Element[0].Type = xml.$Namespace.qualify( \"int\" )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element, statictypeof xml.Element[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element, typeof xml.Element[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.TopLevelElement, statictypeof xml.Element[0].$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.TopLevelElement, typeof xml.Element[0].$TypeInstance )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element, statictypeof xml.Element[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element, typeof xml.Element[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.TopLevelElement, statictypeof xml.Element[0].$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.TopLevelElement, typeof xml.Element[0].$TypeInstance )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Long, $$TESTPACKAGE$$.schema.types.simple.Int.Type.Supertype )" // schema schema built-in types take precedence over alternate schema types
    } )
  }

  @Test
  function testSchemaDefaultCase() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    var tnsURIStr = "http://guidewire.com/webservice/client/config"
    schema.TargetNamespace= new URI(tnsURIStr)
    schema.declareNamespace(schema.TargetNamespace)
    schema.ElementFormDefault = Qualified

    schema.Element[0].Name = "ws-options"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "http-authentication"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = new QName(tnsURIStr, "UsernamePasswordAuthentication")
    schema.Element[0].ComplexType.Sequence.Element[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Choice[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[0].Name = "username-password-authentication"
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[0].Type = new QName(tnsURIStr, "UsernamePasswordAuthentication")
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Name = "wss4j-authentication"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Type = new QName(tnsURIStr, "Properties")
    schema.Element[0].ComplexType.Attribute[0].Name = "server"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "anyURI" )
    schema.Element[0].ComplexType.Attribute[0].Use = Optional
    schema.Element[0].ComplexType.Attribute[1].Name = "time-out"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "nonNegativeInteger" )
    schema.Element[0].ComplexType.Attribute[1].Default = "0"

    schema.ComplexType[0].Name = "UsernamePasswordAuthentication"
    schema.ComplexType[0].Attribute[0].Name = "username"
    schema.ComplexType[0].Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].Attribute[0].Use = Required
    schema.ComplexType[0].Attribute[1].Name = "password"
    schema.ComplexType[0].Attribute[1].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].Attribute[1].Use = Optional

    schema.ComplexType[1].Name = "Properties"
    schema.ComplexType[1].Sequence.Element[0].Name = "property"
    schema.ComplexType[1].Sequence.Element[0].MinOccurs = 0
    schema.ComplexType[1].Sequence.Element[0].MaxOccurs = "unbounded"
    schema.ComplexType[1].Sequence.Element[0].Type = new QName(tnsURIStr, "Property")

    schema.ComplexType[2].Name = "Property"
    schema.ComplexType[2].Attribute[0].Name = "name"
    schema.ComplexType[2].Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[2].Attribute[0].Use = Required
    schema.ComplexType[2].Attribute[1].Name = "value"
    schema.ComplexType[2].Attribute[1].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[2].Attribute[1].Use = Optional
    var expected = "<?xml version=\"1.0\"?>\n" +
        "<xs:schema targetNamespace=\"http://guidewire.com/webservice/client/config\" elementFormDefault=\"qualified\" xmlns=\"http://guidewire.com/webservice/client/config\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">\n" +
        "  <xs:element name=\"ws-options\">\n" +
        "    <xs:complexType>\n" +
        "      <xs:sequence>\n" +
        "        <xs:element name=\"http-authentication\" type=\"UsernamePasswordAuthentication\" minOccurs=\"0\"/>\n" +
        "        <xs:choice minOccurs=\"0\">\n" +
        "          <xs:sequence>\n" +
        "            <xs:element name=\"username-password-authentication\" type=\"UsernamePasswordAuthentication\"/>\n" +
        "          </xs:sequence>\n" +
        "          <xs:element name=\"wss4j-authentication\" type=\"Properties\"/>\n" +
        "        </xs:choice>\n" +
        "      </xs:sequence>\n" +
        "      <xs:attribute name=\"server\" type=\"xs:anyURI\" use=\"optional\"/>\n" +
        "      <xs:attribute name=\"time-out\" type=\"xs:nonNegativeInteger\" default=\"0\"/>\n" +
        "    </xs:complexType>\n" +
        "  </xs:element>\n" +
        "  <xs:complexType name=\"UsernamePasswordAuthentication\">\n" +
        "    <xs:attribute name=\"username\" type=\"xs:string\" use=\"required\"/>\n" +
        "    <xs:attribute name=\"password\" type=\"xs:string\" use=\"optional\"/>\n" +
        "  </xs:complexType>\n" +
        "  <xs:complexType name=\"Properties\">\n" +
        "    <xs:sequence>\n" +
        "      <xs:element name=\"property\" minOccurs=\"0\" maxOccurs=\"unbounded\" type=\"Property\"/>\n" +
        "    </xs:sequence>\n" +
        "  </xs:complexType>\n" +
        "  <xs:complexType name=\"Property\">\n" +
        "    <xs:attribute name=\"name\" type=\"xs:string\" use=\"required\"/>\n" +
        "    <xs:attribute name=\"value\" type=\"xs:string\" use=\"optional\"/>\n" +
        "  </xs:complexType>\n" +
        "</xs:schema>"
    var os = new ByteArrayOutputStream()
    schema.writeTo(os)

    assertEquals(expected, os.toString())
    XmlSchemaTestUtil.runWithResource(schema, {
        "uses java.math.BigInteger",
        "var config = new $$TESTPACKAGE$$.schema.WsOptions()",
        "assertEquals(new BigInteger('0'), config.TimeOut)",
        "config.print()"
    })
  }

  @Test
  function testSchemaWithDefaultNamespaceAndRedefinedDefaultNamespace_PL24981() {
    var xml = new gw.xml.xsd.typeprovider.xmlschemaschematestschema_pl24981.Root()
    xml.Child = 5
    xml = xml.parse( xml.bytes() )
    assertEquals( xml.Child, 5 )
  }

}