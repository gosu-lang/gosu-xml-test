package gw.xml.xsd.typeprovider

uses gw.xml.XmlElement
uses javax.xml.namespace.QName
uses gw.xml.XmlTypeInstance
uses java.lang.Integer
uses gw.internal.xml.XmlConstants
uses gw.lang.reflect.TypeSystem
uses java.net.URI
uses gw.xsd.w3c.xmlschema.types.complex.AnyType
uses gw.xsd.w3c.xmlschema.Schema
uses org.junit.Ignore
uses org.junit.Test

class XmlSchemaTypeInfoTest extends XSDTest {

  @Test
  function testXsdListWithMaxOccursUnbounded() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.List.ItemType = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[0].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertNotNull( xml.Child )",
        "assertEmpty( xml.Child )",
        "xml.Child[0][0] = 0",
        "xml.Child[0][1] = 1",
        "xml.Child[0][2] = 2",
        "xml.Child[1][0] = 10",
        "xml.Child_elem[1].$Value[1] = 11",
        "assertEquals( 2, xml.Child_elem.Count )",
        "assertEquals( 2, xml.Child.Count )",
        "assertEquals( 3, xml.Child_elem[0].$Value.Count )",
        "assertEquals( 3, xml.Child[0].Count )",
        "assertEquals( 2, xml.Child_elem[1].$Value.Count )",
        "assertEquals( 2, xml.Child[1].Count )",
        "assertEquals( 0, xml.Child[0][0] )",
        "assertEquals( 0, xml.Child_elem[0].$Value[0] )",
        "assertEquals( 1, xml.Child[0][1] )",
        "assertEquals( 1, xml.Child_elem[0].$Value[1] )",
        "assertEquals( 2, xml.Child[0][2] )",
        "assertEquals( 2, xml.Child_elem[0].$Value[2] )",
        "assertEquals( 10, xml.Child[1][0] )",
        "assertEquals( 10, xml.Child_elem[1].$Value[0] )",
        "assertEquals( 11, xml.Child[1][1] )",
        "assertEquals( 11, xml.Child_elem[1].$Value[1] )",
        "assertEquals( List<List<java.lang.Integer>>, typeof xml.Child )",
        "assertEquals( List<List<java.lang.Integer>>, statictypeof xml.Child )",
        "assertEquals( List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_Child>, typeof xml.Child_elem )",
        "assertEquals( List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_Child>, statictypeof xml.Child_elem )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 2, xml.Child_elem.Count )",
        "assertEquals( 2, xml.Child.Count )",
        "assertEquals( 3, xml.Child_elem[0].$Value.Count )",
        "assertEquals( 3, xml.Child[0].Count )",
        "assertEquals( 2, xml.Child_elem[1].$Value.Count )",
        "assertEquals( 2, xml.Child[1].Count )",
        "assertEquals( 0, xml.Child[0][0] )",
        "assertEquals( 0, xml.Child_elem[0].$Value[0] )",
        "assertEquals( 1, xml.Child[0][1] )",
        "assertEquals( 1, xml.Child_elem[0].$Value[1] )",
        "assertEquals( 2, xml.Child[0][2] )",
        "assertEquals( 2, xml.Child_elem[0].$Value[2] )",
        "assertEquals( 10, xml.Child[1][0] )",
        "assertEquals( 10, xml.Child_elem[1].$Value[0] )",
        "assertEquals( 11, xml.Child[1][1] )",
        "assertEquals( 11, xml.Child_elem[1].$Value[1] )",
        "assertEquals( List<List<java.lang.Integer>>, typeof xml.Child )",
        "assertEquals( List<List<java.lang.Integer>>, statictypeof xml.Child )",
        "assertEquals( List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_Child>, typeof xml.Child_elem )",
        "assertEquals( List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_Child>, statictypeof xml.Child_elem )"
    } )
  }

  @Test
  function testTypeInstancePropertyOfElementTypeHasCorrectType() {
    var xml = new gw.xsd.w3c.xmlschema.Schema()
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.types.complex.Schema, typeof xml.$TypeInstance )
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.types.complex.Schema, statictypeof xml.$TypeInstance )

    var xml2 = new XmlElement( "Foo" )
    assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, typeof xml2.TypeInstance )
    assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, statictypeof xml2.TypeInstance )
  }

  @Test
  function testXmlElementConstructorAcceptsAnyTypeRatherThanXmlTypeInstance() {
    assertNull( XmlElement.Type.TypeInfo.getConstructor( { QName, XmlTypeInstance } ) )
    assertNotNull( XmlElement.Type.TypeInfo.getConstructor( { QName, gw.xsd.w3c.xmlschema.types.complex.AnyType } ) )
  }

  @Test
  function testComplexTypeThatExtendsComplexTypePicksUpPropertiesFromBaseType() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "ElementOfComplexTypeThatExtendsComplexType"
    schema.Element[0].Type = new QName( "ComplexTypeThatExtendsComplexType" )

    schema.ComplexType[0].Name = "ComplexTypeThatExtendsComplexType"
    schema.ComplexType[0].ComplexContent.Extension.Base = new QName( "ComplexTypeThatIsExtended" )
    schema.ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Name = "AdditionalElement"
    schema.ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    schema.ComplexType[1].Name = "ComplexTypeThatIsExtended"
    schema.ComplexType[1].Sequence.Element[0].Name = "ElementFromBaseType"
    schema.ComplexType[1].Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.ElementOfComplexTypeThatExtendsComplexType()",
        "xml.ElementFromBaseType = 12",
        "xml.AdditionalElement = 42",
        "assertEquals( 2, xml.$Children.Count )",
        "assertEquals( 12, xml.getChild( $$TESTPACKAGE$$.schema.ElementOfComplexTypeThatExtendsComplexType.$ELEMENT_QNAME_ElementFromBaseType ).SimpleValue.GosuValue )",
        "assertEquals( 42, xml.getChild( $$TESTPACKAGE$$.schema.ElementOfComplexTypeThatExtendsComplexType.$ELEMENT_QNAME_AdditionalElement ).SimpleValue.GosuValue )"
    } )
  }

  @Test
  function testAttributesDoNotCreateElementProperties() {
    assertNotNull( gw.xsd.w3c.xmlschema.Schema.Type.TypeInfo.getProperty( "TargetNamespace" ) )
    assertNull( gw.xsd.w3c.xmlschema.Schema.Type.TypeInfo.getProperty( "TargetNamespace_elem" ) )

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "ElementOfComplexTypeWithSimpleContent"
    schema.Element[0].ComplexType.SimpleContent.Extension.Base = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.SimpleContent.Extension.Attribute[0].Name = "ByteAttr"
    schema.Element[0].ComplexType.SimpleContent.Extension.Attribute[0].Type = schema.$Namespace.qualify( "byte" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNotNull( $$TESTPACKAGE$$.schema.ElementOfComplexTypeWithSimpleContent.Type.TypeInfo.getProperty( \"ByteAttr\" ) )",
        "assertNull( $$TESTPACKAGE$$.schema.ElementOfComplexTypeWithSimpleContent.Type.TypeInfo.getProperty( \"ByteAttr_elem\" ) )"
    } )
  }

  @Test
  function testComplexTypeWithSimpleContent() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "ElementOfComplexTypeWithSimpleContent"
    schema.Element[0].ComplexType.SimpleContent.Extension.Base = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.SimpleContent.Extension.Attribute[0].Name = "ByteAttr"
    schema.Element[0].ComplexType.SimpleContent.Extension.Attribute[0].Type = schema.$Namespace.qualify( "byte" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.ElementOfComplexTypeWithSimpleContent()",
        "xml.$Value = 5",
        "assertEquals( java.lang.Integer, typeof xml.$Value )",
        "assertEquals( java.lang.Integer, statictypeof xml.$Value )",
        "assertEquals( 5, xml.$Value )",

        "xml.ByteAttr = 42",
        "assertEquals( java.lang.Byte, typeof xml.ByteAttr )",
        "assertEquals( java.lang.Byte, statictypeof xml.ByteAttr )",
        "assertEquals( 42 as java.lang.Byte, xml.ByteAttr )"
    })
  }

  @Test
  function testPropertyNameConflictBetweenElements() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "bYtes"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "byte" )
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "bytes"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "short" )
    schema.Element[0].ComplexType.Sequence.Element[2].Name = "Bytes"
    schema.Element[0].ComplexType.Sequence.Element[2].Type = schema.$Namespace.qualify( "long" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( java.lang.Byte, statictypeof xml.BYtes )",
        "assertEquals( java.lang.Short, statictypeof xml.Bytes )",
        "assertEquals( java.lang.Long, statictypeof xml.Bytes2 )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Byte, statictypeof xml.BYtes_elem.$TypeInstance )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Short, statictypeof xml.Bytes_elem.$TypeInstance )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Long, statictypeof xml.Bytes2_elem.$TypeInstance )",
        "assertNotNull( ( statictypeof xml ).TypeInfo.getProperty( \"BYtes_elem\" ) )",
        "assertNotNull( ( statictypeof xml ).TypeInfo.getProperty( \"Bytes_elem\" ) )",
        "assertNotNull( ( statictypeof xml ).TypeInfo.getProperty( \"Bytes2_elem\" ) )",
        "assertNull( ( statictypeof xml ).TypeInfo.getProperty( \"bytes_elem\" ) ) // has been proper-cased to 'Bytes'",

        "assertNull( xml.Bytes2 )",
        "xml.Bytes2 = 12345",
        "assertEquals( java.lang.Long, typeof xml.Bytes2 )",
        "assertEquals( 12345 as long, xml.Bytes2 )"
    } )
  }

  @Test
  function testPropertyNameConflictBetweenElementAndAttribute() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "abc"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Attribute[0].Name = "abc"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Abc_Element = 5",
        "xml.Abc_Attribute = 10",
        "assertEquals( 5, xml.Abc_Element )",
        "assertEquals( 5, xml.Abc_Element_elem.$Value )",
        "assertEquals( 10, xml.Abc_Attribute )"
    } )
  }

  @Test
  function testPropertyNameConflictBetweenElementAndAttributeAfterNormalization() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "abc-def"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Attribute[0].Name = "abcDef" // identical name after normalization
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.AbcDef_Element = 5",
        "xml.AbcDef_Attribute = 10",
        "assertEquals( 5, xml.AbcDef_Element )",
        "assertEquals( 5, xml.AbcDef_Element_elem.$Value )",
        "assertEquals( 10, xml.AbcDef_Attribute )"
    } )
  }

  @Test
  function testPropertyNameConflictBetweenAttributes() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Name = "abc"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Attribute[0].Form = Qualified
    schema.Element[0].ComplexType.Attribute[1].Name = "Abc" // identical name after normalization
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Attribute[2].Name = "ABc" // non-identical name after normalization
    schema.Element[0].ComplexType.Attribute[2].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Abc = 5",
        "xml.Abc2 = 10",
        "xml.ABc = 15",
        "assertEquals( \"5\", xml.getAttributeValue( new javax.xml.namespace.QName( \"urn:schema\", \"abc\" ) ) )",
        "assertEquals( \"10\", xml.getAttributeValue( new javax.xml.namespace.QName( \"Abc\" ) ) )",
        "assertEquals( \"15\", xml.getAttributeValue( new javax.xml.namespace.QName( \"ABc\" ) ) )"
    } )
  }

  @Test
  function testSimpleTypesCreateSimpleProperties() {
    var x = new gw.xml.xsd.typeprovider.test.SimpleTypePropertyTest()
    x.ElementSimpleType = 5
    x.ElementSimpleTypeInline = 10
    x.ElementSimpleContent = 15
    x.ElementSimpleContent_elem.Attr = 20

    assertEquals( Integer, typeof x.ElementSimpleType )
    assertEquals( Integer, statictypeof x.ElementSimpleType )
    assertEquals( 5, x.ElementSimpleType )
    assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, typeof x.ElementSimpleType_elem.$TypeInstance )
    assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, statictypeof x.ElementSimpleType_elem.$TypeInstance )

    assertEquals( Integer, typeof x.ElementSimpleTypeInline )
    assertEquals( Integer, statictypeof x.ElementSimpleTypeInline )
    assertEquals( 10, x.ElementSimpleTypeInline )
    assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, typeof x.ElementSimpleTypeInline_elem.$TypeInstance )
    assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, statictypeof x.ElementSimpleTypeInline_elem.$TypeInstance )

    assertEquals( Integer, typeof x.ElementSimpleContent )
    assertEquals( Integer, statictypeof x.ElementSimpleContent )
    assertEquals( 15, x.ElementSimpleContent )
    assertEquals( gw.xml.xsd.typeprovider.test.anonymous.types.complex.SimpleTypePropertyTest_ElementSimpleContent, typeof x.ElementSimpleContent_elem.$TypeInstance )
    assertEquals( gw.xml.xsd.typeprovider.test.anonymous.types.complex.SimpleTypePropertyTest_ElementSimpleContent, statictypeof x.ElementSimpleContent_elem.$TypeInstance )
    assertEquals( Integer, typeof x.ElementSimpleContent_elem.Attr )
    assertEquals( Integer, statictypeof x.ElementSimpleContent_elem.Attr )
    assertEquals( 20, x.ElementSimpleContent_elem.Attr )
  }

  @Test
  function testSanityCheckOnComplexSchema() {
    var xml = new gw.xsd.w3c.xmlschema.Schema()
    xml.Element[0].ComplexType.Sequence.Element[0].Name = "Foo"
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.elements.ExplicitGroup_Element, statictypeof xml.Element[0].ComplexType.Sequence.Element[0] )
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.elements.ExplicitGroup_Element, typeof xml.Element[0].ComplexType.Sequence.Element[0] )
    assertEquals( gw.xsd.w3c.xmlschema.types.complex.LocalElement, statictypeof xml.Element[0].ComplexType.Sequence.Element[0].$TypeInstance )
    assertEquals( gw.xsd.w3c.xmlschema.types.complex.LocalElement, typeof xml.Element[0].ComplexType.Sequence.Element[0].$TypeInstance )
  }

  @Test
  function testInclude() {
    // ElementFromIncludedSchema is in the typesystem twice - one from having been loaded directly, and
    // once from having been included in another schema
    new gw.xml.xsd.typeprovider.includetest.ElementFromParentSchema().print()
    new gw.xml.xsd.typeprovider.includetest.ElementFromIncludedSchema().print()
    new gw.xml.xsd.typeprovider.included.ElementFromIncludedSchema().print()
    var x = new gw.xml.xsd.typeprovider.includetest.Root()
    assertTrue( statictypeof x.ElementFromIncludedSchema == gw.xml.xsd.typeprovider.includetest.ElementFromIncludedSchema )

    // chameleon transformation (xsd spec) says that included schema inherits parent's targetNamespace ( and requires it to define either the same or no targetNamespace )
    assertEquals( XmlConstants.NULL_NS_URI, new gw.xml.xsd.typeprovider.included.ElementFromIncludedSchema().$QName.NamespaceURI )
    assertEquals( "http://guidewire.com/includetest.xsd", new gw.xml.xsd.typeprovider.includetest.ElementFromIncludedSchema().$QName.NamespaceURI )
  }

  @Test
  function testAnonymousTypeTakesParentElementsName() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = \"foo\"",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )"
    } )
  }

  @Test
  function testEnhancementsOnSchemaBasedXmlElements() {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.Foo = "foo"
    assertEquals( "foo", xml.String )
    xml.String = "bar"
    assertEquals( "bar", xml.Foo )
    xml.Foo( "baz" )
    assertEquals( "baz", xml.String )
    assertEquals( "baz", xml.Foo() )
  }

  @Test
  function testTestSchemaIsLoaded() {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    gw.xml.xsd.typeprovider.tst.Root.parse( xml.asUTFString() )
  }

  @Test
  // xsd:anyType (which is default if no type is specified for an element) should result in a property of type gw.xsd.w3c.xmlschema.types.complex.AnyType
  function testXSDAnyTypeResultsInPropertyOfTypeAnyType()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    assertNotNull( gw.xml.xsd.typeprovider.tst.Root.Type.TypeInfo.getProperty( "AnyType" ) )
    assertNotNull( gw.xml.xsd.typeprovider.tst.Root.Type.TypeInfo.getProperty( "AnyType2" ) )
    assertNull( gw.xml.xsd.typeprovider.tst.Root.Type.TypeInfo.getProperty( "AnyType_elem" ) )
    assertNull( gw.xml.xsd.typeprovider.tst.Root.Type.TypeInfo.getProperty( "AnyType2_elem" ) )
    assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, statictypeof xml.AnyType.$TypeInstance )
    assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, statictypeof xml.AnyType2.$TypeInstance )
    xml.AnyType.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()
    xml.AnyType2.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()
  }

  @Test
  function testAttributeNamesPropertyIsSetOfQName()
  {
    assertEquals( java.util.Set<QName>, statictypeof new gw.xml.xsd.typeprovider.tst.Root().$AttributeNames )
  }

  @Test
  function testAnonymousElementReferencesDontCreateTypes() {
    var base = "gw.xml.xsd.typeprovider.import1.anonymous.elements.TypeFromImport1_"
    assertNotNull( TypeSystem.getByFullNameIfValid( "${ base }String" ) )
    assertNull( TypeSystem.getByFullNameIfValid( "${ base }ElementFromImport1" ) )
    assertNull( TypeSystem.getByFullNameIfValid( "${ base }ElementFromImport2" ) )
  }

  @Test
  function testMultipleElementsWithSameNameAreMergedIntoSingleProperty() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Name = "first"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[1].Name = "second"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[1].Element[0].Name = "third"
    schema.Element[0].ComplexType.Sequence.Choice[1].Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[1].Element[1].Name = "first"
    schema.Element[0].ComplexType.Sequence.Choice[1].Element[1].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.First[0] = 1",
        "xml.Second = 2",
        "assertEquals( java.util.List<java.lang.Integer>, statictypeof xml.First )",
        "assertEquals( java.util.List<java.lang.Integer>, typeof xml.First )",
        "assertEquals( java.util.List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_First>, statictypeof xml.First_elem )",
        "assertEquals( java.util.List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_First>, typeof xml.First_elem )",
        "assertEquals( java.lang.Integer, statictypeof xml.Second )",
        "assertEquals( java.lang.Integer, typeof xml.Second )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Second, statictypeof xml.Second_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Second, typeof xml.Second_elem )",
        "assertTrue( java.util.regex.Pattern.compile( \".*second.*first.*\", java.util.regex.Pattern.DOTALL ).matcher( xml.asUTFString() ).matches() )",
        "xml.parse( xml.bytes() )",
        "assertEquals( java.util.List<java.lang.Integer>, statictypeof xml.First )",
        "assertEquals( java.util.List<java.lang.Integer>, typeof xml.First )",
        "assertEquals( java.util.List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_First>, statictypeof xml.First_elem )",
        "assertEquals( java.util.List<$$TESTPACKAGE$$.schema.anonymous.elements.Root_First>, typeof xml.First_elem )",
        "assertEquals( java.lang.Integer, statictypeof xml.Second )",
        "assertEquals( java.lang.Integer, typeof xml.Second )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Second, statictypeof xml.Second_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Second, typeof xml.Second_elem )",
        "assertTrue( java.util.regex.Pattern.compile( \".*second.*first.*\", java.util.regex.Pattern.DOTALL ).matcher( xml.asUTFString() ).matches() )",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.First[0] = 1",
        "xml.Third = 3",
        "assertTrue( java.util.regex.Pattern.compile( \".*first.*third.*\", java.util.regex.Pattern.DOTALL ).matcher( xml.asUTFString() ).matches() )",
        "xml = xml.parse( xml.bytes() )",
        "assertTrue( java.util.regex.Pattern.compile( \".*first.*third.*\", java.util.regex.Pattern.DOTALL ).matcher( xml.asUTFString() ).matches() )",
        "assertNotNull( $$TESTPACKAGE$$.schema.Root.Type.TypeInfo.getProperty( \"First\" ) )",
        "assertNull( $$TESTPACKAGE$$.schema.Root.Type.TypeInfo.getProperty( \"First2\" ) )"
    } )
  }

  @Test
  function testTypeInstanceCannotBeSetToIncompatibleType() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml : gw.xml.XmlElement = new $$TESTPACKAGE$$.schema.Root()",
        "xml.TypeInstance = new gw.xsd.w3c.xmlschema.types.simple.Short()", // ok
        "try {",
        "  xml.TypeInstance = new gw.xsd.w3c.xmlschema.types.simple.Long()", // fails
        "  fail( \"Expected ClassCastException\" )",
        "}",
        "catch ( ex : java.lang.ClassCastException ) {",
        "  // good",
        "}"
    } )

  }

  @Test
  function testPluralityCalculation() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[1].Name = "B"
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[2].Name = "C"
    schema.Element[0].ComplexType.Sequence.Choice[0].Sequence[0].Element[2].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "C"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].MinOccurs = 0

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( List<java.lang.Integer>, statictypeof xml.A )",
        "assertEquals( java.lang.Integer, statictypeof xml.B )",
        "assertEquals( List<java.lang.Integer>, statictypeof xml.C )"
    } )
  }

  @Test
  function testAttributeRef() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Attribute[0].Name = "Attr"
    schema.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Ref = new QName( "Attr" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attr = 3",
        "xml.Attr = 4",
        "xml.Attr = 5",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Attr )"
    } )
  }

  @Test
  function testAttributeGroupRef() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.AttributeGroup[0].Name = "AttrGroup"
    schema.AttributeGroup[0].Attribute[0].Name = "Attr"
    schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.AttributeGroup[0].Ref = new QName( "AttrGroup" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attr = 3",
        "xml.Attr = 4",
        "xml.Attr = 5",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Attr )"
    } )
  }

  @Test
  function testAttributeAnonymousSimpleTypeEnumeration() {
    // XmlSchemaAttributeIndexer was not traversing into attribute simple types... Writing this test for the fix
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Restriction.Enumeration[0].Value = "Foo"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Restriction.Enumeration[1].Value = "Bar"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr, statictypeof xml.Attr )",
        "xml.Attr = Foo",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr, typeof xml.Attr )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr.Foo, xml.Attr )",
        "xml.Attr = Bar",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr.Bar, xml.Attr )"
    } )
  }

  @Test
  function testElementAnonymousSimpleTypeEnumeration() {
    // XmlSchemaAttributeIndexer was not traversing into attribute simple types... Writing this test for the fix
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Enumeration[0].Value = "Foo"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Enumeration[1].Value = "Bar"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, statictypeof xml.Child )",
        "xml.Child = Foo",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child.Foo, xml.Child )",
        "xml.Child = Bar",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Child.Bar, xml.Child )"
    } )
  }

  @Test
  function testAttributeAnonymousSimpleTypeUnionEnumeration() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Union.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Union.SimpleType[0].Restriction.Enumeration[0].Value = "Foo"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Union.SimpleType[0].Restriction.Enumeration[1].Value = "Bar"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr, statictypeof xml.Attr )",
        "xml.Attr = Foo",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr, typeof xml.Attr )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr.Foo, xml.Attr )",
        "xml.Attr = Bar",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr.Bar, xml.Attr )"
    } )
  }

  @Test
  function testAttributeAnonymousSimpleTypeListEnumeration() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.List.SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Attribute[0].SimpleType.List.SimpleType.Restriction.Enumeration[0].Value = "Foo"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.List.SimpleType.Restriction.Enumeration[1].Value = "Bar"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( List<$$TESTPACKAGE$$.schema.enums.Root_Attr>, statictypeof xml.Attr )",
        "xml.Attr = { Foo, Bar }",
        "assertEquals( List<$$TESTPACKAGE$$.schema.enums.Root_Attr>, typeof xml.Attr )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr.Foo, xml.Attr[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root_Attr.Bar, xml.Attr[1] )"
    } )
  }

  @Test
  @Ignore("Need to find these xsds")
  function testSchemaNameDotsAreNormalizedToUnderscores() {
//    var xml = new gw.xml.xsd.typeprovider.test_with_dots.Root()
//    xml.$Value = 5
//    assertTrue( xml.asUTFString().contains( "Root" ) )
  }

  @Test
  @Ignore("Need to find these xsds")
  function testCanImportSchemaWithDots() {
//    var xml = new gw.xml.xsd.typeprovider.test_with_dots_import.Root()
//    xml.Root = 5
//    assertTrue( xml.asUTFString().contains( "urn:dots" ) )
  }

  @Test
  @Ignore("Value coercion change?")
  function testEnum() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.SimpleType[0].Name = "MyEnum"
    schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.SimpleType[0].Restriction.Enumeration[0].Value = "##value1"
    schema.SimpleType[0].Restriction.Enumeration[1].Value = "##value2"
    schema.SimpleType[0].Restriction.Enumeration[2].Value = "##value3"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var e = $$TESTPACKAGE$$.schema.enums.MyEnum.Value2",
        "assertEquals( \"##value2\", e.toString() )",
        "assertEquals( \"##value2\", e.SerializedValue )",
        "assertEquals( \"Value2\", e as String )",
        "assertEquals( 1, e.ordinal() )",
        "assertEquals( \"Value2\", e.name() )",
        "assertSame( e, $$TESTPACKAGE$$.schema.enums.MyEnum.valueOf( \"Value2\" ) )",
        "assertSame( e, $$TESTPACKAGE$$.schema.enums.MyEnum.values()[1] )",
        "assertEquals( 3, $$TESTPACKAGE$$.schema.enums.MyEnum.values().length )"
    } )
  }

  @Test
  function testProhibitedAttribute() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr1"
    schema.Element[0].ComplexType.Attribute[1].Name = "Attr2"
    schema.Element[0].ComplexType.Attribute[1].Use = Prohibited

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNotNull( $$TESTPACKAGE$$.schema.Root.Type.TypeInfo.getProperty( \"Attr1\" ) )",
        "assertNull( $$TESTPACKAGE$$.schema.Root.Type.TypeInfo.getProperty( \"Attr2\" ) )"
    } )

  }

  @Test
  function testTypeNameWithUnderscoresIsProperlyCamelCased() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.ComplexType[0].Name = "foo_bar"
    schema.ComplexType[0].Sequence.Element[0].Name = "_baz_quux"
    schema.ComplexType[0].Sequence.Element[0].ComplexType.Sequence.Element[0].Name = "__bam__bam__"
    schema.ComplexType[0].Sequence.Element[0].ComplexType.Sequence.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNotNull( $$TESTPACKAGE$$.schema.types.complex.FooBar )",
        "assertNotNull( $$TESTPACKAGE$$.schema.anonymous.elements.FooBar_BazQuux )",
        "assertNotNull( $$TESTPACKAGE$$.schema.anonymous.elements.FooBar_BazQuux__Bam_Bam__ )",
        "assertNotNull( $$TESTPACKAGE$$.schema.anonymous.types.complex.FooBar_BazQuux )",
        "assertNotNull( $$TESTPACKAGE$$.schema.anonymous.types.simple.FooBar_BazQuux__Bam_Bam__ )"
    } )

  }

  @Test
  function testPropertyNameWithUnderscoresIsProperlyCamelCased() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "foo_bar"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "baz_quux"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.FooBar()",
        "xml.BazQuux = 42",
        "assertNotNull( $$TESTPACKAGE$$.schema.anonymous.elements.FooBar_BazQuux )"
    } )
  }

  @Test
  function testNameWithCapitalLetterRetainsUnderscore() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "foo_Bar"

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNotNull( $$TESTPACKAGE$$.schema.Foo_Bar )"
    } )
  }

  // not sure this is the right thing to do, but didn't want to make the name normalization rules too complicated,
  // so this test is around a (lack of) behavior that maybe should have been done differently, but probably isn't
  // that big of a deal
  @Test
  function testNameWithCapitalLetterPriorToUnderscoreDoesNotChangeBehavior() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "IDREF_attr"

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNotNull( $$TESTPACKAGE$$.schema.IDREFAttr )"
    } )
  }

  @Test
  function testStaticQNamePropertiesWithElementFormDefaultUnqualified() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:target" )
    schema.Element[0].Name = "rootEl"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( new javax.xml.namespace.QName( \"urn:target\", \"rootEl\" ), $$TESTPACKAGE$$.schema.RootEl.$QNAME )",
        "assertEquals( new javax.xml.namespace.QName( \"child\" ), $$TESTPACKAGE$$.schema.RootEl.$ELEMENT_QNAME_Child )",
        "assertEquals( new javax.xml.namespace.QName( \"child\" ), $$TESTPACKAGE$$.schema.anonymous.elements.RootEl_Child.$QNAME )"
    } )
  }

  @Test
  function testStaticQNamePropertiesWithElementFormDefaultQualified() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:target" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "rootEl"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"

    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( new javax.xml.namespace.QName( \"urn:target\", \"rootEl\" ), $$TESTPACKAGE$$.schema.RootEl.$QNAME )",
        "assertEquals( new javax.xml.namespace.QName( \"urn:target\", \"child\" ), $$TESTPACKAGE$$.schema.RootEl.$ELEMENT_QNAME_Child )",
        "assertEquals( new javax.xml.namespace.QName( \"urn:target\", \"child\" ), $$TESTPACKAGE$$.schema.anonymous.elements.RootEl_Child.$QNAME )"
    } )
  }

  @Test
  function testTypeNamesAreCorrect() {
    // names of array types were broken, so wrote this test
    assertEquals( "gw.xml.XmlElement", gw.xml.XmlElement.Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.types.complex.AnyType", gw.xsd.w3c.xmlschema.types.complex.AnyType.Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.Schema", gw.xsd.w3c.xmlschema.Schema.Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.enums.All_MaxOccurs", gw.xsd.w3c.xmlschema.enums.All_MaxOccurs.Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.util", gw.xsd.w3c.xmlschema.util.Type.Name )

    assertEquals( "gw.xml.XmlElement[]", gw.xml.XmlElement[].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.types.complex.AnyType[]", gw.xsd.w3c.xmlschema.types.complex.AnyType[].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.Schema[]", gw.xsd.w3c.xmlschema.Schema[].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.enums.All_MaxOccurs[]", gw.xsd.w3c.xmlschema.enums.All_MaxOccurs[].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.util[]", gw.xsd.w3c.xmlschema.util[].Type.Name )

    assertEquals( "gw.xml.XmlElement[][]", gw.xml.XmlElement[][].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.types.complex.AnyType[][]", gw.xsd.w3c.xmlschema.types.complex.AnyType[][].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.Schema[][]", gw.xsd.w3c.xmlschema.Schema[][].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.enums.All_MaxOccurs[][]", gw.xsd.w3c.xmlschema.enums.All_MaxOccurs[][].Type.Name )
    assertEquals( "gw.xsd.w3c.xmlschema.util[][]", gw.xsd.w3c.xmlschema.util[][].Type.Name )

    assertEquals( "java.util.List<gw.xml.XmlElement>", List<gw.xml.XmlElement>.Type.Name )
    assertEquals( "java.util.List<gw.xsd.w3c.xmlschema.types.complex.AnyType>", List<gw.xsd.w3c.xmlschema.types.complex.AnyType>.Type.Name )
    assertEquals( "java.util.List<gw.xsd.w3c.xmlschema.Schema>", List<gw.xsd.w3c.xmlschema.Schema>.Type.Name )
    assertEquals( "java.util.List<gw.xsd.w3c.xmlschema.enums.All_MaxOccurs>", List<gw.xsd.w3c.xmlschema.enums.All_MaxOccurs>.Type.Name )
    assertEquals( "java.util.List<gw.xsd.w3c.xmlschema.util>", List<gw.xsd.w3c.xmlschema.util>.Type.Name )
  }

  @Test
  function testXmlElementContainsEmptyStringSimpleValueByDefault() {
    var xml = new XmlElement( "root" )
    assertNotNull( xml.SimpleValue )
    assertEquals( "", xml.SimpleValue.StringValue )
    assertEquals( "", xml.Text )
    assertNotNull( xml.TypeInstance.$SimpleValue )
    assertEquals( "", xml.TypeInstance.$SimpleValue.StringValue )
    assertEquals( "", xml.TypeInstance.$Text )
  }

  @Test
  function testAnyTypeContainsEmptyStringSimpleValueByDefault() {
    var anytype = new AnyType()
    assertNotNull( anytype.$SimpleValue )
    assertEquals( "", anytype.$SimpleValue.StringValue )
    assertEquals( "", anytype.$Text )
  }

  @Test
  function testTypedXmlElementDeclaredToContainTextHasNullSimpleValueByDefault() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "string" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertNull( xml.$SimpleValue )",
        "assertEquals( \"\", xml.$Text )",
        "assertNull( xml.$TypeInstance.$SimpleValue )",
        "assertEquals( \"\", xml.$TypeInstance.$Text )"
    } )
  }

  @Test
  function testTwoAnonymousElementsWithSameNameAndDifferentTypes() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child1"
    schema.Element[0].ComplexType.Sequence.Element[0].ComplexType.Sequence.Element[0].Name = "subchild"
    schema.Element[0].ComplexType.Sequence.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "short" )
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "child2"
    schema.Element[0].ComplexType.Sequence.Element[1].ComplexType.Sequence.Element[0].Name = "subchild"
    schema.Element[0].ComplexType.Sequence.Element[1].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "long" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child1.Subchild = 5",
        "xml.Child2.Subchild = 10",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1_Subchild, typeof xml.Child1.Subchild_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1_Subchild, statictypeof xml.Child1.Subchild_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2_Subchild, typeof xml.Child2.Subchild_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2_Subchild, statictypeof xml.Child2.Subchild_elem )",
        "assertEquals( java.lang.Short, typeof xml.Child1.Subchild )",
        "assertEquals( java.lang.Short, statictypeof xml.Child1.Subchild )",
        "assertEquals( java.lang.Long, typeof xml.Child2.Subchild )",
        "assertEquals( java.lang.Long, statictypeof xml.Child2.Subchild )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1_Subchild, typeof xml.Child1.Subchild_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1_Subchild, statictypeof xml.Child1.Subchild_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2_Subchild, typeof xml.Child2.Subchild_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2_Subchild, statictypeof xml.Child2.Subchild_elem )",
        "assertEquals( java.lang.Short, typeof xml.Child1.Subchild )",
        "assertEquals( java.lang.Short, statictypeof xml.Child1.Subchild )",
        "assertEquals( java.lang.Long, typeof xml.Child2.Subchild )",
        "assertEquals( java.lang.Long, statictypeof xml.Child2.Subchild )"
    } )
  }

  @Test
  function testTopLevelElementWithSameNameAsAnonymousElement() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "child" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "long" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child.Child_elem )",
        "assertEquals( java.lang.Long, typeof xml.Child.Child )",
        "assertEquals( java.lang.Long, statictypeof xml.Child.Child )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child.Child_elem )",
        "assertEquals( java.lang.Long, typeof xml.Child.Child )",
        "assertEquals( java.lang.Long, statictypeof xml.Child.Child )"
    } )
  }

  @Test
  function testEnhancementPropertyOnSuperTypeAppearsOnSubType() {
    var subComplexType = new gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.types.complex.Sub()
    assertEquals( "value", ( subComplexType as gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.types.complex.Super ).TestPropertyOnSuperComplexType )
    assertEquals( "value", subComplexType.TestPropertyOnSuperComplexType )
    var subElement = new gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.Sub()
    assertEquals( "value", ( subElement as gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.Super ).TestPropertyOnSuperElement )
    assertEquals( "value", subElement.TestPropertyOnSuperElement )
    // not sure if this is the right behavior, but it is the curent behavior that enhancement properties on the backing typeinstance do not appear on the element
    assertNull( gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.Super.Type.TypeInfo.getProperty( "TestPropertyOnSuperComplexType" ) )
    assertNull( gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.Super.Type.TypeInfo.getProperty( "$TestPropertyOnSuperComplexType" ) )
    assertNull( gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.Sub.Type.TypeInfo.getProperty( "TestPropertyOnSuperComplexType" ) )
    assertNull( gw.xml.xsd.typeprovider.xmlschematypeinfotestenhanced.Sub.Type.TypeInfo.getProperty( "$TestPropertyOnSuperComplexType" ) )
  }

  // PL-16361 - is-i-b-m-v-m becomes IsIBMVMm instead of IsIBMVM
  @Test
  function testPL16361() {
    var myschema = new Schema()
    myschema.Element[0].Name = "root"
    myschema.Element[0].ComplexType.Sequence.Element[0].Name = "is-i-b-m-v-m"
    myschema.Element[0].ComplexType.Sequence.Element[0].Type = myschema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( myschema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.IsIBMVM = 5",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.IsIBMVM )"
    } )
  }

  @Test
  function testElementNameEndingInHyphen() {
    var myschema = new Schema()
    myschema.Element[0].Name = "root"
    myschema.Element[0].ComplexType.Sequence.Element[0].Name = "is-i-b-m-v-m-"
    myschema.Element[0].ComplexType.Sequence.Element[0].Type = myschema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( myschema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.IsIBMVM_ = 5",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.IsIBMVM_ )"
    } )
  }

  @Test
  function testTwoGroupReferencesCausesTwoDistinctSetsOfTypes() {
    var myschema = new Schema()
    myschema.Element[0].Name = "root1"
    myschema.Element[0].ComplexType.Sequence.Group[0].Ref = new QName( "top-level-group" )
    myschema.Element[1].Name = "root2"
    myschema.Element[1].ComplexType.Sequence.Group[0].Ref = new QName( "top-level-group" )
    myschema.Group[0].Name = "top-level-group"
    myschema.Group[0].Sequence.Element[0].Name = "child"
    myschema.Group[0].Sequence.Element[0].Type = myschema.$Namespace.qualify( "int" )

    myschema.Group[0].Sequence.Element[1].Name = "child2"
    myschema.Group[0].Sequence.Element[1].MinOccurs = 0

    myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[0] = new()
    var el = myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[0]
    el.Name = "element-with-facets"
    el.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "decimal" )

    myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[1] = new()
    var el2 = myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[1]
    el2.Name = "element-with-facets-2"
    el2.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "string" )

    myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[2] = new()
    var el3 = myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[2]
    el3.Name = "element-with-facets-3"
    el3.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "decimal" )

    myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[3] = new()
    var el4 = myschema.Group[0].Sequence.Element[1].ComplexType.Sequence.Element[3]
    el4.Name = "element-with-facets-4"
    el4.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "string" )

    el.SimpleType.Restriction.FractionDigits[0].Value = 3
    el.SimpleType.Restriction.MinInclusive[0].Value = "3"
    el.SimpleType.Restriction.MaxInclusive[0].Value = "3"
    el.SimpleType.Restriction.Pattern[0].Value = "abc"
    el.SimpleType.Restriction.TotalDigits[0].Value = 3
    el.SimpleType.Restriction.WhiteSpace[0].Value = Collapse

    el2.SimpleType.Restriction.Enumeration[0].Value = "red"
    el2.SimpleType.Restriction.MinLength[0].Value = 1
    el2.SimpleType.Restriction.MaxLength[0].Value = 3

    el3.SimpleType.Restriction.MinExclusive[0].Value = "3"
    el3.SimpleType.Restriction.MaxExclusive[0].Value = "3"

    el4.SimpleType.Restriction.Length[0].Value = 2

    XmlSchemaTestUtil.runWithResource( myschema, {
        "var root1 = new $$TESTPACKAGE$$.schema.Root1()",
        "root1.Child = 5",
        "root1.print()", // not a debugging statement
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root1_Child, statictypeof root1.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root1_Child, typeof root1.Child_elem )",
        "var root2 = new $$TESTPACKAGE$$.schema.Root2()",
        "root2.Child = 5",
        "root2.print()", // not a debugging statement
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root2_Child, statictypeof root2.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root2_Child, typeof root2.Child_elem )"
    } )
  }

  @Test
  function testTwoAttributeGroupReferencesCausesTwoDistinctSetsOfTypes() {
    var myschema = new Schema()
    myschema.Element[0].Name = "root1"
    myschema.Element[0].ComplexType.AttributeGroup[0].Ref = new QName( "top-level-group" )
    myschema.Element[1].Name = "root2"
    myschema.Element[1].ComplexType.AttributeGroup[0].Ref = new QName( "top-level-group" )
    myschema.AttributeGroup[0].Name = "top-level-group"
    myschema.AttributeGroup[0].Attribute[0].Name = "attribute-with-facets"
    myschema.AttributeGroup[0].Attribute[1].Name = "attribute-with-facets2"
    myschema.AttributeGroup[0].Attribute[2].Name = "attribute-with-facets3"
    myschema.AttributeGroup[0].Attribute[3].Name = "attribute-with-facets4"
    myschema.AttributeGroup[0].Attribute[4].Name = "attr"
    myschema.AttributeGroup[0].Attribute[4].Type = myschema.$Namespace.qualify( "int" )

    var el = myschema.AttributeGroup[0].Attribute[0]
    var el2 = myschema.AttributeGroup[0].Attribute[1]
    var el3 = myschema.AttributeGroup[0].Attribute[2]
    var el4 = myschema.AttributeGroup[0].Attribute[3]

    el.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "decimal" )
    el.SimpleType.Restriction.FractionDigits[0].Value = 3
    el.SimpleType.Restriction.MinInclusive[0].Value = "3"
    el.SimpleType.Restriction.MaxInclusive[0].Value = "3"
    el.SimpleType.Restriction.Pattern[0].Value = "abc"
    el.SimpleType.Restriction.TotalDigits[0].Value = 3
    el.SimpleType.Restriction.WhiteSpace[0].Value = Collapse

    el2.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "string" )
    el2.SimpleType.Restriction.Enumeration[0].Value = "red"
    el2.SimpleType.Restriction.MinLength[0].Value = 1
    el2.SimpleType.Restriction.MaxLength[0].Value = 3

    el3.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "decimal" )
    el3.SimpleType.Restriction.MinExclusive[0].Value = "3"
    el3.SimpleType.Restriction.MaxExclusive[0].Value = "3"

    el4.SimpleType.Restriction.Base = myschema.$Namespace.qualify( "string" )
    el4.SimpleType.Restriction.Length[0].Value = 2

    XmlSchemaTestUtil.runWithResource( myschema, {
        "var root1 = new $$TESTPACKAGE$$.schema.Root1()",
        "root1.Attr = 5",
        "root1.print()", // not a debugging statement
        "assertNotNull( $$TESTPACKAGE$$.schema.anonymous.attributes.Root1_Attr )",
        "var root2 = new $$TESTPACKAGE$$.schema.Root2()",
        "root2.Attr = 5",
        "root2.print()", // not a debugging statement
        "assertNotNull( $$TESTPACKAGE$$.schema.anonymous.attributes.Root2_Attr )"
    } )
  }

}