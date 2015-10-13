package gw.xml.xsd.typeprovider

uses org.junit.Test

uses javax.xml.namespace.QName
uses java.lang.Integer

class XmlSchemaUnionTest extends XSDTest {

  @Test
  function testNothing() {
  }

  @Test
  function testUnionOfSimpleTypesWithEmbeddedLongBecomesLong() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.SimpleType[0].Name = "UnionOfSimpleTypesWithEmbeddedLongBecomesLong"
    schema.SimpleType[0].Union.MemberTypes[0] = schema.$Namespace.qualify( "short" )
    schema.SimpleType[0].Union.MemberTypes[1] = schema.$Namespace.qualify( "int" )
    schema.SimpleType[0].Union.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "long" )

    schema.Element[0].Name = "UnionOfSimpleTypesWithEmbeddedLongBecomesLong"
    schema.Element[0].Type = new QName( "UnionOfSimpleTypesWithEmbeddedLongBecomesLong" )

    schema.Element[1].Name = "ElementContainingUnionOfSimpleTypesWithEmbeddedLongBecomesLong"
    schema.Element[1].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[1].ComplexType.Sequence.Element[0].Type = new QName( "UnionOfSimpleTypesWithEmbeddedLongBecomesLong" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.ElementContainingUnionOfSimpleTypesWithEmbeddedLongBecomesLong()",
        "assertEquals( java.lang.Long, statictypeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.UnionOfSimpleTypesWithEmbeddedLongBecomesLong, statictypeof xml.Child_elem.$TypeInstance )",
        "var xml2 = new $$TESTPACKAGE$$.schema.anonymous.types.complex.ElementContainingUnionOfSimpleTypesWithEmbeddedLongBecomesLong()",
        "assertEquals( java.lang.Long, statictypeof xml2.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.UnionOfSimpleTypesWithEmbeddedLongBecomesLong, statictypeof xml2.Child_elem.$TypeInstance )"
    })
  }

  @Test
  function testUnionOfSimpleTypesWithEmbeddedByteBecomesInt() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.SimpleType[0].Name = "UnionOfSimpleTypesWithEmbeddedByteBecomesInt"
    schema.SimpleType[0].Union.MemberTypes[0] = schema.$Namespace.qualify( "short" )
    schema.SimpleType[0].Union.MemberTypes[1] = schema.$Namespace.qualify( "int" )
    schema.SimpleType[0].Union.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "byte" )

    schema.Element[0].Name = "UnionOfSimpleTypesWithEmbeddedByteBecomesInt"
    schema.Element[0].Type = new QName( "UnionOfSimpleTypesWithEmbeddedByteBecomesInt" )

    schema.Element[1].Name = "ElementContainingUnionOfSimpleTypesWithEmbeddedByteBecomesInt"
    schema.Element[1].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[1].ComplexType.Sequence.Element[0].Type = new QName( "UnionOfSimpleTypesWithEmbeddedByteBecomesInt" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.ElementContainingUnionOfSimpleTypesWithEmbeddedByteBecomesInt()",
        "assertEquals( java.lang.Integer, statictypeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.UnionOfSimpleTypesWithEmbeddedByteBecomesInt, statictypeof xml.Child_elem.$TypeInstance )",
        "var xml2 = new $$TESTPACKAGE$$.schema.anonymous.types.complex.ElementContainingUnionOfSimpleTypesWithEmbeddedByteBecomesInt()",
        "assertEquals( java.lang.Integer, statictypeof xml2.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.UnionOfSimpleTypesWithEmbeddedByteBecomesInt, statictypeof xml2.Child_elem.$TypeInstance )"
    } )
  }

  function testUnionOfDifferentPrimitiveTypesBecomesString() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.SimpleType[0].Name = "MyType"
    schema.SimpleType[0].Union.MemberTypes[0] = schema.$Namespace.qualify( "byte" )
    schema.SimpleType[0].Union.MemberTypes[1] = schema.$Namespace.qualify( "gMonth" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.types.simple.MyType()",
        "assertEquals( java.lang.String, statictypeof xml.$Value )",
        "xml.$Value = \"100\"", // valid byte value
        "xml.$Value = \"--12\"", // valid gMonth value
        "xml.$Value = \"--12+07:00\"", // valid gMonth value
        "try {",
        "  xml.$Value = \"500\"", // invalid
        "  fail( \"Expected XmlSimpleValueException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSimpleValueException ) {",
        "  // good",
        "}",
        ""
    } )
  }

  @Test
  function testUnionOfXsdIntProducesPropertyOfTypeInteger()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.Union = 42 as short
    assertEquals( Integer, statictypeof xml.Union )
    assertEquals( Integer, typeof xml.Union )
    assertEquals( 42, xml.Union )
  }

}