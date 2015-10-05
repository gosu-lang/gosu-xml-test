package gw.xml.xsd.typeprovider

uses gw.xml.XmlElement
uses gw.xml.XmlTypeInstance
uses org.junit.Test

uses javax.xml.namespace.QName

class XmlSchemaTypeHierarchyTest extends XSDTest {

  @Test
  function testNothing() {
  }

  @Test
  function testComplexTypeExtendsXmlTypeInstance() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.ComplexType[0].Name = "MyComplexType"

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertTrue( gw.xml.XmlTypeInstance.Type.isAssignableFrom( $$TESTPACKAGE$$.schema.types.complex.MyComplexType ) )",
        "assertFalse( gw.xml.XmlElement.Type.isAssignableFrom( $$TESTPACKAGE$$.schema.types.complex.MyComplexType ) )"
    } )
  }

  @Test
  function testSimpleTypeExtendsXmlTypeInstance() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.SimpleType[0].Name = "MySimpleType"
    schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertTrue( gw.xml.XmlTypeInstance.Type.isAssignableFrom( $$TESTPACKAGE$$.schema.types.simple.MySimpleType ) )",
        "assertFalse( gw.xml.XmlElement.Type.isAssignableFrom( $$TESTPACKAGE$$.schema.types.simple.MySimpleType ) )"
    } )
  }

  @Test
  function testElementExtendsXmlElement() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "MyElement"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertFalse( gw.xml.XmlTypeInstance.Type.isAssignableFrom( $$TESTPACKAGE$$.schema.MyElement ) )",
        "assertTrue( gw.xml.XmlElement.Type.isAssignableFrom( $$TESTPACKAGE$$.schema.MyElement ) )"
    } )
  }

  @Test
  function testAnySimpleTypeExtendsAnyType() {
    assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, gw.xsd.w3c.xmlschema.types.simple.AnySimpleType.Type.Supertype )
  }

  @Test
  function testXsdListExtendsAnySimpleType() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.SimpleType[0].Name = "List"
    schema.SimpleType[0].List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.AnySimpleType,$$TESTPACKAGE$$. schema.types.simple.List.Type.Supertype )",
        "var x = new $$TESTPACKAGE$$.schema.types.simple.List()",
        "assertEquals( java.util.List<java.lang.Integer>, statictypeof x.$Value )",
        "x.$Value = { 1, 2, 3 }",
        "assertEquals( java.util.List<java.lang.Integer>, typeof x.$Value )"
    } )
  }

  @Test
  function testXsdUnionExtendsAnySimpleType() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.SimpleType[0].Name = "Union"
    schema.SimpleType[0].Union.MemberTypes = { schema.$Namespace.qualify( "int" ), schema.$Namespace.qualify( "date" ) }

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.AnySimpleType, $$TESTPACKAGE$$.schema.types.simple.Union.Type.Supertype )",
        "var x = new $$TESTPACKAGE$$.schema.types.simple.Union()",
        "assertEquals( java.lang.String, statictypeof x.$Value )",
        "x.$Value = \"123\"",
        "assertEquals( java.lang.String, typeof x.$Value )"
    } )
  }

  @Test
  function testComplexTypeHierarchy() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.ComplexType[0].Name = "ExtendsSimpleComplexType"
    schema.ComplexType[0].ComplexContent.Restriction.Base = new QName( "SimpleComplexType" )

    schema.ComplexType[1].Name = "SimpleComplexType"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var baseType = $$TESTPACKAGE$$.schema.types.complex.SimpleComplexType.Type",
        "var subType = $$TESTPACKAGE$$.schema.types.complex.ExtendsSimpleComplexType.Type",
        "var anyType = gw.xsd.w3c.xmlschema.types.complex.AnyType.Type",
        "assertEquals( baseType, subType.Supertype )",
        "assertEquals( anyType, baseType.Supertype )",
        "assertEquals( gw.xml.XmlTypeInstance, anyType.Supertype )",
        "assertTrue( baseType.isAssignableFrom( subType ) )"
    } )
  }

  @Test
  function testSimpleTypeHierarchy() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "SimpleSimpleType"
    schema.Element[0].Type = new QName( "SimpleSimpleType" )

    schema.SimpleType[0].Name = "ExtendsSimpleSimpleType"
    schema.SimpleType[0].Restriction.Base = new QName( "SimpleSimpleType" )

    schema.SimpleType[1].Name = "SimpleSimpleType"
    schema.SimpleType[1].Restriction.Base = schema.$Namespace.qualify( "byte" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var baseType = $$TESTPACKAGE$$.schema.types.simple.SimpleSimpleType.Type",
        "var type = $$TESTPACKAGE$$.schema.types.simple.ExtendsSimpleSimpleType.Type.Supertype",
        "assertEquals( baseType, type )",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Byte, type)",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Short, type)",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, type)",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Long, type )",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Integer, type )",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Decimal, type )",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.AnySimpleType, type )",
        "type = type.Supertype",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, type )",
        "type = type.Supertype",
        "assertEquals( gw.xml.XmlTypeInstance, type )"
    } )
  }

  @Test
  function testElementHierarchy() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "A"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )

    schema.Element[1].Name = "B"
    schema.Element[1].Type = schema.$Namespace.qualify( "short" )
    schema.Element[1].SubstitutionGroup = new QName( "A" )

    schema.Element[2].Name = "C"
    schema.Element[2].Type = schema.$Namespace.qualify( "byte" )
    schema.Element[2].SubstitutionGroup = new QName( "B" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var baseType = $$TESTPACKAGE$$.schema.A.Type",
        "var subType = $$TESTPACKAGE$$.schema.B.Type",
        "var subSubType = $$TESTPACKAGE$$.schema.C.Type",
        "assertEquals( subType, subSubType.Supertype )",
        "assertEquals( baseType, subType.Supertype )",
        "assertEquals( gw.xml.XmlElement, baseType.Supertype )",
        "assertTrue( baseType.isAssignableFrom( subType ) )",
        "assertTrue( baseType.isAssignableFrom( subSubType ) )"
    })
  }

  @Test
  function testGeneratedElementsExtendXmlElement()
  {
    assertTrue( XmlElement.Type.isAssignableFrom( gw.xml.xsd.typeprovider.tst.Root ) )
    assertFalse( XmlTypeInstance.Type.isAssignableFrom( gw.xml.xsd.typeprovider.tst.Root ) )
  }

  @Test
  function testGeneratedTypesExtendXmlTypeInstance()
  {
    assertTrue( XmlTypeInstance.Type.isAssignableFrom( gw.xml.xsd.typeprovider.tst.types.simple.Color ) )
    assertFalse( XmlElement.Type.isAssignableFrom( gw.xml.xsd.typeprovider.tst.types.simple.Color ) )
  }

}