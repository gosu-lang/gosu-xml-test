package gw.xml.xsd.typeprovider

uses javax.xml.namespace.QName
uses java.net.URI
uses gw.xsd.w3c.xmlschema.Schema
uses gw.xsd.w3c.xmlschema.Enumeration
uses gw.xml.XmlSimpleValue
uses org.junit.Test

class XmlSchemaEnumerationTest extends XSDTest {

  @Test
  function testSimpleTypeRestrictionEnumeration() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Enumeration[0].Value = "Foo"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Enumeration[1].Value = "Bar"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = Foo",
        "xml.Child = Bar",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child.Bar, xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child.Bar, xml.Child_elem.$Value )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, statictypeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, typeof xml.Child_elem.$Value )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, statictypeof xml.Child_elem.$Value )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.simple.Root_Child, typeof xml.Child_elem.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.simple.Root_Child, statictypeof xml.Child_elem.$TypeInstance )"
    } )
  }

  @Test
  function testSimpleContentRestrictionEnumeration() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].ComplexType.SimpleContent.Restriction.Base =     new QName( "MyType" )
    schema.Element[0].ComplexType.Sequence.Element[0].ComplexType.SimpleContent.Restriction.Enumeration[0].Value = "Foo"
    schema.Element[0].ComplexType.Sequence.Element[0].ComplexType.SimpleContent.Restriction.Enumeration[1].Value = "Bar"
    schema.ComplexType[0].Name = "MyType"
    schema.ComplexType[0].SimpleContent.Extension.Base = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = Foo",
        "xml.Child = Bar",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child.Bar, xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child.Bar, xml.Child_elem.$Value )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, statictypeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, typeof xml.Child_elem.$Value )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, statictypeof xml.Child_elem.$Value )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root_Child, typeof xml.Child_elem.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root_Child, statictypeof xml.Child_elem.$TypeInstance )"
    } )
  }

  @Test
  function testIndirectEnumeration() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].SimpleType.Restriction.Base = new QName( "MyType" )
    schema.SimpleType[0].Name = "MyType"
    schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.SimpleType[0].Restriction.Enumeration[0].Value = "Foo"
    schema.SimpleType[0].Restriction.Enumeration[1].Value = "Bar"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = Foo",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.MyType, typeof xml.$Value )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.MyType, statictypeof xml.$Value )"
    } )
  }

  @Test
  function testNotation() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Notation[0].Name = "jpeg"
    schema.Notation[0].Public = "image/jpeg"
    schema.Notation[0].System = new URI( "viewer.exe" ) // example from the schema specification
    schema.SimpleType[0].Name = "MyNotation"
    schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "NOTATION" )
    schema.SimpleType[0].Restriction.Enumeration[0].Value = "jpeg"
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "MyNotation" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.MyNotation, statictypeof xml.$Value )",
        "xml.$Value = Jpeg",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.MyNotation, typeof xml.$Value )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.MyNotation, typeof xml.$Value )"
    } )
  }

  @Test
  function testJavaBackedEnumerationShowsInTypeInfoAsNonJavaBacked() {
    assertEquals( gw.xsd.w3c.xmlschema.enums.FormChoice, typeof gw.xsd.w3c.xmlschema.enums.FormChoice.Unqualified )
  }

  @Test
  function testJavaBackedEnumerationToStringGivesCorrectValue() {
    assertEquals( "unqualified", gw.xsd.w3c.xmlschema.enums.FormChoice.Unqualified.toString() )
  }

  @Test
  function testJiraPL12848() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].SimpleType.Restriction.Enumeration[0].Value = "1 is One"
    schema.Element[0].SimpleType.Restriction.Enumeration[1].Value = "FOO BAR BAZ"
    schema.Element[0].SimpleType.Restriction.Enumeration[2].Value = "##targetNamespace"
    schema.Element[0].SimpleType.Restriction.Enumeration[3].Value = "abc-def-ghi"
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = _1_is_One",
        "xml.$Value = FOO_BAR_BAZ",
        "xml.$Value = TargetNamespace",
        "xml.$Value = Abc_def_ghi"
    } )
  }

  @Test
  function testEnumThatRestrictsQName_NonJavaBacked() {
    var type = new gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.types.simple.SimpleTypeThatEnumeratesQName()
    type.$Value = B    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesQName, statictypeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesQName, typeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesQName.B, type.$Value )
    assertEquals( QName, statictypeof type.$Value.GosuValue )
    assertEquals( QName, typeof type.$Value.GosuValue )
    assertEquals( new QName( "urn:b", "b" ), type.$Value.GosuValue )
  }

  @Test
  function testEnumThatRestrictsInt_NonJavaBacked() {
    var type = new gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.types.simple.SimpleTypeThatEnumeratesInt()
    type.$Value = _2
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesInt, statictypeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesInt, typeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesInt._2, type.$Value )
    assertEquals( java.lang.Integer, statictypeof type.$Value.GosuValue )
    assertEquals( java.lang.Integer, typeof type.$Value.GosuValue )
    assertEquals( 2, type.$Value.GosuValue )
  }

  @Test
  function testEnumThatRestrictsString_NonJavaBacked() {
    var type = new gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.types.simple.SimpleTypeThatEnumeratesString()
    type.$Value = B
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString, statictypeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString, typeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString.B, type.$Value )
    assertEquals( java.lang.String, statictypeof type.$Value.GosuValue )
    assertEquals( java.lang.String, typeof type.$Value.GosuValue )
    assertEquals( "b", type.$Value.GosuValue )
  }

  @Test
  function testEnumThatRestrictsQName_JavaBacked() {
    var type = new gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.types.simple.SimpleTypeThatEnumeratesQName()
    type.$Value = B    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesQName, statictypeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesQName, typeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesQName.B, type.$Value )
    assertEquals( QName, statictypeof type.$Value.GosuValue )
    assertEquals( QName, typeof type.$Value.GosuValue )
    assertEquals( new QName( "urn:b", "b" ), type.$Value.GosuValue )
  }

  @Test
  function testEnumThatRestrictsInt_JavaBacked() {
    var type = new gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.types.simple.SimpleTypeThatEnumeratesInt()
    type.$Value = _2
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesInt, statictypeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesInt, typeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesInt._2, type.$Value )
    assertEquals( java.lang.Integer, statictypeof type.$Value.GosuValue )
    assertEquals( java.lang.Integer, typeof type.$Value.GosuValue )
    assertEquals( 2, type.$Value.GosuValue )
  }

  @Test
  function testEnumThatRestrictsString_JavaBacked() {
    var type = new gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.types.simple.SimpleTypeThatEnumeratesString()
    type.$Value = B
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString, statictypeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString, typeof type.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString.B, type.$Value )
    assertEquals( java.lang.String, statictypeof type.$Value.GosuValue )
    assertEquals( java.lang.String, typeof type.$Value.GosuValue )
    assertEquals( "b", type.$Value.GosuValue )
  }

  @Test
  function testJavaBackedSchemaIsActuallyJavaBacked() {
    assertEquals( "gw.internal.xml.xsd.typeprovider.XmlSchemaEnumValue",
        gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesQName.B.Class.Name )
  }

  @Test
  function testNonJavaBackedSchemaIsActuallyNonJavaBacked() {
    assertEquals( "gw.internal.xml.xsd.typeprovider.XmlSchemaEnumValue",
        gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesQName.B.Class.Name )
  }

  @Test
  function testEnumerationThatRestrictsQNameWithDuplicateValues() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "QName" )
    schema.Element[0].SimpleType.Restriction.Enumeration[0] = new Enumeration()
    schema.Element[0].SimpleType.Restriction.Enumeration[0].setAttributeSimpleValue( Enumeration.$ATTRIBUTE_QNAME_Value, XmlSimpleValue.makeQNameInstance( new QName( "nsuri", "localpart", "prefix1" ) ) )
    schema.Element[0].SimpleType.Restriction.Enumeration[1] = new Enumeration()
    schema.Element[0].SimpleType.Restriction.Enumeration[1].setAttributeSimpleValue( Enumeration.$ATTRIBUTE_QNAME_Value, XmlSimpleValue.makeQNameInstance( new QName( "nsuri", "localpart", "prefix2" ) ) )
    schema.Element[0].SimpleType.Restriction.Enumeration[2] = new Enumeration()
    schema.Element[0].SimpleType.Restriction.Enumeration[2].setAttributeSimpleValue( Enumeration.$ATTRIBUTE_QNAME_Value, XmlSimpleValue.makeQNameInstance( new QName( "nsuri", "localpart2", "prefix3" ) ) )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = Localpart",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Localpart, xml.$Value )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Localpart, xml.$Value )",
        "assertEquals( 2, $$TESTPACKAGE$$.schema.enums.Root.values().Count )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Localpart, $$TESTPACKAGE$$.schema.enums.Root.values()[0] )",
        "assertEquals( 0, $$TESTPACKAGE$$.schema.enums.Root.Localpart.Ordinal )",
        "assertEquals( 0, $$TESTPACKAGE$$.schema.enums.Root.Localpart.ordinal() )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Localpart2, $$TESTPACKAGE$$.schema.enums.Root.values()[1] )",
        "assertEquals( 1, $$TESTPACKAGE$$.schema.enums.Root.Localpart2.Ordinal )",
        "assertEquals( 1, $$TESTPACKAGE$$.schema.enums.Root.Localpart2.ordinal() )"
    } )
  }

  @Test
  function testOrdinalReturnsCorrectValue_JavaBacked() {
    assertEquals( 0, gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString.A.Ordinal )
    assertEquals( 0, gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString.A.ordinal() )
    assertEquals( 1, gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString.B.Ordinal )
    assertEquals( 1, gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString.B.ordinal() )
    assertEquals( 2, gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString.C.Ordinal )
    assertEquals( 2, gw.xml.xsd.typeprovider.xmlschemaenumerationtest_javabacked.enums.SimpleTypeThatEnumeratesString.C.ordinal() )
  }

  @Test
  function testOrdinalReturnsCorrectValue_NonJavaBacked() {
    assertEquals( 0, gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString.A.Ordinal )
    assertEquals( 0, gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString.A.ordinal() )
    assertEquals( 1, gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString.B.Ordinal )
    assertEquals( 1, gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString.B.ordinal() )
    assertEquals( 2, gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString.C.Ordinal )
    assertEquals( 2, gw.xml.xsd.typeprovider.xmlschemaenumerationtestschema.enums.SimpleTypeThatEnumeratesString.C.ordinal() )
  }

}