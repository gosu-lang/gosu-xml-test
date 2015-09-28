package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses java.net.URI
uses javax.xml.namespace.QName
uses gw.xml.XmlException
uses org.junit.Test

class XmlSchemaCircularIncludeTest extends XSDTest {

  @Test
  function testCircularInclude_NoNamespace() {
    var schema1 = new Schema()
    schema1.Include[0].SchemaLocation = new URI( "schema2.xsd" )
    schema1.Element[0].Name = "Root1"
    schema1.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "Child2" )
    schema1.Element[1].Name = "Child1"
    schema1.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    var schema2 = new Schema()
    schema2.Include[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Root2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "Child1" )
    schema2.Element[1].Name = "Child2"
    schema2.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResources( { schema1, schema2 }, {
        "var xml1 = new $$TESTPACKAGE$$.schema.Root1()",
        "xml1.Child2 = 5",
        "xml1 = xml1.parse( xml1.bytes() )",
        "assertEquals( 5, xml1.Child2 )",
        "var xml2 = new $$TESTPACKAGE$$.schema2.Root2()",
        "xml2.Child1 = 5",
        "xml2 = xml2.parse( xml2.bytes() )",
        "assertEquals( 5, xml2.Child1 )"
    } )
  }

  @Test
  function testCircularRedefine_NoNamespace() {
    var schema1 = new Schema()
    schema1.Redefine[0].SchemaLocation = new URI( "schema2.xsd" )
    schema1.Element[0].Name = "Root1"
    schema1.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "Child2" )
    schema1.Element[1].Name = "Child1"
    schema1.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    var schema2 = new Schema()
    schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Root2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "Child1" )
    schema2.Element[1].Name = "Child2"
    schema2.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResources( { schema1, schema2 }, {
        "var xml1 = new $$TESTPACKAGE$$.schema.Root1()",
        "xml1.Child2 = 5",
        "xml1 = xml1.parse( xml1.bytes() )",
        "assertEquals( 5, xml1.Child2 )",
        "var xml2 = new $$TESTPACKAGE$$.schema2.Root2()",
        "xml2.Child1 = 5",
        "xml2 = xml2.parse( xml2.bytes() )",
        "assertEquals( 5, xml2.Child1 )"
    } )
  }

  @Test
  function testCircularInclude_WithNamespace() {
    var schema1 = new Schema()
    schema1.TargetNamespace = new URI( "urn:foo" )
    schema1.Include[0].SchemaLocation = new URI( "schema2.xsd" )
    schema1.Element[0].Name = "Root1"
    schema1.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:foo", "Child2" )
    schema1.Element[1].Name = "Child1"
    schema1.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    var schema2 = new Schema()
    schema2.TargetNamespace = new URI( "urn:foo" )
    schema2.Include[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Root2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:foo", "Child1" )
    schema2.Element[1].Name = "Child2"
    schema2.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResources( { schema1, schema2 }, {
        "var xml1 = new $$TESTPACKAGE$$.schema.Root1()",
        "xml1.Child2 = 5",
        "xml1 = xml1.parse( xml1.bytes() )",
        "assertEquals( 5, xml1.Child2 )",
        "var xml2 = new $$TESTPACKAGE$$.schema2.Root2()",
        "xml2.Child1 = 5",
        "xml2 = xml2.parse( xml2.bytes() )",
        "assertEquals( 5, xml2.Child1 )"
    } )
  }

  @Test
  function testCircularRedefine_WithNamespace() {
    var schema1 = new Schema()
    schema1.TargetNamespace = new URI( "urn:foo" )
    schema1.Redefine[0].SchemaLocation = new URI( "schema2.xsd" )
    schema1.Element[0].Name = "Root1"
    schema1.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:foo", "Child2" )
    schema1.Element[1].Name = "Child1"
    schema1.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    var schema2 = new Schema()
    schema2.TargetNamespace = new URI( "urn:foo" )
    schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Root2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:foo", "Child1" )
    schema2.Element[1].Name = "Child2"
    schema2.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResources( { schema1, schema2 }, {
        "var xml1 = new $$TESTPACKAGE$$.schema.Root1()",
        "xml1.Child2 = 5",
        "xml1 = xml1.parse( xml1.bytes() )",
        "assertEquals( 5, xml1.Child2 )",
        "var xml2 = new $$TESTPACKAGE$$.schema2.Root2()",
        "xml2.Child1 = 5",
        "xml2 = xml2.parse( xml2.bytes() )",
        "assertEquals( 5, xml2.Child1 )"
    } )
  }

  @Test
  function testCircularInclude_Chameleon_Bidirectional() {
    // schema 1 has namespace, schema 2 does not, schema2 fails to parse since it cannot include schema 1
    var schema1 = new Schema()
    schema1.TargetNamespace = new URI( "urn:schema1" )
    schema1.Include[0].SchemaLocation = new URI( "schema2.xsd" )
    schema1.Element[0].Name = "Root1"
    schema1.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:schema1", "Child2" )
    schema1.Element[1].Name = "Child1"
    schema1.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    var schema2 = new Schema()
    schema2.Include[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Root2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:schema1", "Child1" )
    schema2.Element[1].Name = "Child2"
    schema2.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    try {
      XmlSchemaTestUtil.runWithResources( { schema1, schema2 }, new String[0] )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertEquals("src-include.2.1: The targetNamespace of the referenced schema, 'urn:schema1', must be identical to that of the including schema, ''", ex.Cause.Message)
    }
  }

  @Test
  function testCircularRedefine_Chameleon_Bidirectional() {
    // schema 1 has namespace, schema 2 does not, schema2 fails to parse since it cannot include schema 1
    var schema1 = new Schema()
    schema1.TargetNamespace = new URI( "urn:schema1" )
    schema1.Redefine[0].SchemaLocation = new URI( "schema2.xsd" )
    schema1.Element[0].Name = "Root1"
    schema1.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:schema1", "Child2" )
    schema1.Element[1].Name = "Child1"
    schema1.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    var schema2 = new Schema()
    schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Root2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:schema1", "Child1" )
    schema2.Element[1].Name = "Child2"
    schema2.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    try {
      XmlSchemaTestUtil.runWithResources( { schema1, schema2 }, new String[0] )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertEquals("src-include.2.1: The targetNamespace of the referenced schema, 'urn:schema1', must be identical to that of the including schema, ''",  ex.Cause.Message )
    }
  }

  @Test
  function testCircularInclude_Chameleon_Unidirectional() {
    var schema1 = new Schema()
    schema1.TargetNamespace = new URI( "urn:schema1" )
    schema1.Include[0].SchemaLocation = new URI( "schema2.xsdi" )
    schema1.Element[0].Name = "Root1"
    schema1.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:schema1", "Child2" )
    schema1.Element[1].Name = "Child1"
    schema1.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    var schema2 = new Schema()
    schema2.Include[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Root2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:schema1", "Child1" )
    schema2.Element[1].Name = "Child2"
    schema2.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResources( { schema1, schema2 }, { "schema.xsd", "schema2.xsdi" }, {
        "var xml1 = new $$TESTPACKAGE$$.schema.Root1()",
        "xml1.Child2 = 5",
        "xml1 = xml1.parse( xml1.bytes() )",
        "assertEquals( 5, xml1.Child2 )"
    } )
  }

  //TODO - should we move this WSDL out?
//  @Test
//  function testPL27090() {
//    // these schemas would previously fail to load
//    assertNotNull( new gw.xml.xsd.typeprovider.pl27090.cdm_policyinquiry.PolicyInquiryService() )
//  }

}