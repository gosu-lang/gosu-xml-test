package gw.xml.xsd.typeprovider

uses gw.xml.XmlElement
uses javax.xml.namespace.QName
uses gw.xml.XmlException
uses gw.internal.xml.XmlConstants
uses org.junit.Test

class XmlSchemaNilTest extends XSDTest {

  @Test
  function testNilPropertyDoesNotCreateAttributeInAttributeMap() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Nillable = true
    schema.print()
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertTrue( xml.$AttributeNames.Empty )",
        "assertFalse( xml.$Nil )",
        "xml.$Nil = true",
        "assertTrue( xml.$AttributeNames.Empty )",
        "assertTrue( xml.$Nil )",
        "xml.$Nil = false",
        "assertTrue( xml.$AttributeNames.Empty )",
        "assertFalse( xml.$Nil )"
    } )
  }

  @Test
  function testNilWithChildrenThrowsException() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Nillable = true
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.print()
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "xml.$Nil = true",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "}"
    } )
  }

  @Test
  function testNilWithoutChildrenIsAcceptable() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Nillable = true
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child" // required child element, but can disregard children if element has xsi:nil="true"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Nil = true",
        "xml.print()"
    } )
  }

  @Test
  function testSortContinuesPastNilChild() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Element[0].Nillable = true
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "B"
    schema.Element[0].ComplexType.Sequence.Element[1].Nillable = true
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.A_elem.$Nil = true",
        "xml.B = 5",
        "xml.print()",
        "xml.A = 5",
        "xml.A_elem.$Nil = false",
        "xml.B = null",
        "xml.B_elem.$Nil = true",
        "xml.print()",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.A_elem.$Nil = true",
        "xml.B_elem.$Nil = true",
        "xml.print()"
    } )
  }

  @Test
  function testNilRemainsAfterReparse_Root() {
    var xml = new XmlElement( "root" )
    xml.Nil = true
    assertTrue( xml.Nil )
    assertTrue( xml.AttributeNames.isEmpty() )
    xml = xml.parse( xml.bytes() )
    assertTrue( xml.Nil )
    assertTrue( xml.AttributeNames.isEmpty() )
  }

  @Test
  function testNilRemainsAfterReparse_Child() {
    var xml = new XmlElement( "root" )
    xml.addChild( new XmlElement( "child" ) { : Nil = true } )
    assertEquals( 1, xml.Children.Count )
    assertTrue( xml.Children[0].Nil )
    assertTrue( xml.Children[0].AttributeNames.isEmpty() )
    xml = xml.parse( xml.bytes() )
    assertEquals( 1, xml.Children.Count )
    assertTrue( xml.Children[0].Nil )
    assertTrue( xml.Children[0].AttributeNames.isEmpty() )
  }

  @Test
  function testNilRemainsAfterReparse_GrandChild() {
    var xml = new XmlElement( "root" )
    var child1 = new XmlElement( "child1" ) { : Nil = true }
    var child2_1 = new XmlElement( "child2_1" ) { : Nil = false }
    var child2_2 = new XmlElement( "child2_2" ) { : Nil = true }

    child1.addChild( child2_1 )
    child1.addChild( child2_2 )
    xml.addChild( child1 )
    xml.print()

    assertEquals( 1, xml.Children.Count )
    assertTrue( xml.Children[0].Nil )

    assertEquals( 2, xml.Children[0].Children.Count )
    assertFalse( xml.Children[0].Children[0].Nil )
    assertTrue( xml.Children[0].Children[1].Nil )

    assertTrue( xml.Children[0].AttributeNames.isEmpty() )
    assertTrue( xml.Children[0].Children[0].AttributeNames.isEmpty() )
    assertTrue( xml.Children[0].Children[1].AttributeNames.isEmpty() )

    xml = xml.parse( xml.bytes() )
    assertEquals( 1, xml.Children.Count )
    assertTrue( xml.Children[0].Nil )
    assertFalse( xml.Children[0].Children[0].Nil )
    assertTrue( xml.Children[0].Children[1].Nil )

    assertTrue( xml.Children[0].AttributeNames.isEmpty() )
    assertTrue( xml.Children[0].Children[0].AttributeNames.isEmpty() )
    assertTrue( xml.Children[0].Children[1].AttributeNames.isEmpty() )
  }

  @Test
  function testAttemptToSetNilAttributeValueDirectlyIsNotAllowed() {
    var xml = new XmlElement( "root" )
    try {
      xml.setAttributeValue( new QName( XmlConstants.W3C_XML_SCHEMA_INSTANCE_NS_URI, "nil" ), "true" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertTrue( ex.Message.contains( "Setting xsi:nil directly is not supported" ) )
    }
  }

}