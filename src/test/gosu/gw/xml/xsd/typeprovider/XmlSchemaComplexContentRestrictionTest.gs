package gw.xml.xsd.typeprovider

uses javax.xml.namespace.QName
uses gw.xsd.w3c.xmlschema.Schema
uses org.junit.Test

class XmlSchemaComplexContentRestrictionTest extends XSDTest {

  function getSchema() : gw.xsd.w3c.xmlschema.Schema {
    return getSchemaWhereType1IsRestrictedByType2( "int", "byte" )
  }

  function getSchemaWhereType1IsRestrictedByType2( type1 : String, type2 : String ) : gw.xsd.w3c.xmlschema.Schema {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.ComplexType[0].Name = "mytype"
    schema.ComplexType[0].Sequence.Element[0].Name = "child"
    schema.ComplexType[0].Sequence.Element[0].Type = schema.$Namespace.qualify( type1 )

    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.ComplexContent.Restriction.Base = new QName( "mytype" )
    schema.Element[0].ComplexType.ComplexContent.Restriction.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.ComplexContent.Restriction.Sequence.Element[0].Type = schema.$Namespace.qualify( type2 )
    return schema
  }

  @Test
  function testTypeInfo() {
    var schema = getSchema()
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 42",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )",
        "assertEquals( gw.xml.XmlElement, $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child.Type.Supertype )",
        "assertEquals( java.lang.Byte, statictypeof xml.Child )",
        "assertEquals( java.lang.Byte, typeof xml.Child )",
        "assertEquals( java.lang.Byte, statictypeof xml.Child_elem.$Value )",
        "assertEquals( java.lang.Byte, typeof xml.Child_elem.$Value )"
    } )
  }

  @Test
  function testRestrictingElementWithOutOfRangeType() {
    var schema = getSchemaWhereType1IsRestrictedByType2( "byte", "int" )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {} )
    }
    catch ( e : java.lang.RuntimeException ) {
      var cause = e.getCauseOfType( org.xml.sax.SAXParseException )
      assertNotNull("Exception cause of type SAXParseException", cause)
      assertTrue(cause.Message.contains("The type of element 'child', 'int', is not derived from the type of the base element, 'byte'"))

    }
  }

  @Test
  function testRestrictingElementWithIncompatibleType() {
    var schema = getSchemaWhereType1IsRestrictedByType2( "int", "string" )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {} )
    }
    catch ( e : java.lang.RuntimeException ) {
      var cause = e.getCauseOfType( org.xml.sax.SAXParseException )
      assertNotNull("Exception cause of type SAXParseException", cause)
      assertTrue(cause.Message.contains("The type of element 'child', 'string', is not derived from the type of the base element, 'int'"))
    }
  }

  @Test
  function testProhibitedAttribute() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.ComplexContent.Restriction.Base = new QName( "rootType" )
    schema.Element[0].ComplexType.ComplexContent.Restriction.Attribute[0].Name = "attr"
    schema.Element[0].ComplexType.ComplexContent.Restriction.Attribute[0].Use = Prohibited
    schema.ComplexType[0].Name = "rootType"
    schema.ComplexType[0].Attribute[0].Name = "attr"
    schema.ComplexType[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNull( $$TESTPACKAGE$$.schema.Root.Type.TypeInfo.getProperty( 'Attr' ) )"
    } )
  }

  @Test
  function testNonProhibitedAttribute() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.ComplexContent.Restriction.Base = new QName( "rootType" )
    schema.ComplexType[0].Name = "rootType"
    schema.ComplexType[0].Attribute[0].Name = "attr"
    schema.ComplexType[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNotNull( $$TESTPACKAGE$$.schema.Root.Type.TypeInfo.getProperty( 'Attr' ) )",
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attr = 5",
        "assertEquals( 5, xml.Attr )"
    } )
  }

  @Test
  function testMinOccursIsNotAvailableOnTopLevelElement() {
    var schema = new Schema()
    var elementType = ( statictypeof schema.Element[0] )
    assertNull( elementType.TypeInfo.getProperty( "MinOccurs" ) )
  }

}