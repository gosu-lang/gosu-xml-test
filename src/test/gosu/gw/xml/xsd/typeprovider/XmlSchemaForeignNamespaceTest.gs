package gw.xml.xsd.typeprovider

uses org.junit.Test

uses java.net.URI
uses javax.xml.namespace.QName

/**
 * I'm not sure if the terminology is good, but I consider a foreign namespace to be a namespace defined
 * by a schema that cannot be implicitly determined when parsing an instance document. For example,
 * Schema B imports Schema A, and provides a substitution group member for an element defined in A.
 * When A.parse( "<ElementFromB/>" ) is called, we determine the actual schema to validate against
 * based on the schema associated with the itype "A". There is, therefore, no way to determine how
 * to resolve ElementFromB since it's not defined in that schema. Therefore, when parsing, the
 * "B" schema must be explicitly specified by the user by using the "AdditionalSchemas" property
 * of the XmlParseOptions object.
 */
class XmlSchemaForeignNamespaceTest {

  @Test
  function testSubtypesAcrossSchemasWithoutExplicitImport() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "schema", "MyType" )
    schema.ComplexType[0].Name = "MyType"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.ComplexType[0].Name = "MyType"
    schema2.ComplexType[0].ComplexContent.Extension.Base = new QName( "schema", "MyType" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$TypeInstance = new $$TESTPACKAGE$$.schema2.types.complex.MyType()",
        "try {",
        "  xml = xml.parse( xml.bytes() )",
        "  fail( \"Expected XmlException\" )",
        "}",
        "catch ( ex : gw.xml.XmlException ) {",
        "  // good",
        "}",
        "xml = xml.parse( xml.bytes(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, typeof xml.$TypeInstance )",
        "xml = xml.parse( xml.asUTFString(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, typeof xml.$TypeInstance )"
    } )
  }

  @Test
  function testSubtypesAcrossSchemasWithExplicitImport() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "schema", "MyType" )
    schema.ComplexType[0].Name = "MyType"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.ComplexType[0].Name = "MyType"
    schema2.ComplexType[0].ComplexContent.Extension.Base = new QName( "schema", "MyType" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$TypeInstance = new $$TESTPACKAGE$$.schema2.types.complex.MyType()",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, typeof xml.$TypeInstance )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, typeof xml.$TypeInstance )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, typeof xml.$TypeInstance )"
    } )
  }

  // the point of this test is that the foreign schema (schema2) needs to be included at validation time, or the validation will fail
  @Test
  function testSubstitutionGroupFromForeignNamespace() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "schema", "Child" )
    schema.Element[1].Name = "Child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Child2"
    schema2.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema2.Element[0].SubstitutionGroup = new QName( "schema", "Child" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var child2 = new $$TESTPACKAGE$$.schema2.Child2()",
        "child2.$Value = 42",
        "xml.Child_elem = child2",
        "assertTrue( xml.asUTFString().contains( \"Child2\" ) )",
        "xml = xml.parse( xml.bytes(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"Child2\" ) )",
        "xml = xml.parse( xml.asUTFString(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"Child2\" ) )"
    } )
  }

  @Test
  function testSubstitutionGroupFromForeignNamespaceTwiceRemoved() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "schema", "Child" )
    schema.Element[1].Name = "Child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Child2"
    schema2.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema2.Element[0].SubstitutionGroup = new QName( "schema", "Child" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.Import[0].Namespace = new URI( "schema2" )
    schema3.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema3.Element[0].Name = "Child3"
    schema3.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema3.Element[0].SubstitutionGroup = new QName( "schema2", "Child2" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var child3 = new $$TESTPACKAGE$$.schema3.Child3()",
        "child3.$Value = 42",
        "xml.Child_elem = child3",
        "assertTrue( xml.asUTFString().contains( \"Child3\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema3.Child3, typeof xml.Child_elem )",
        "xml = xml.parse( xml.bytes(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema3.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"Child3\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema3.Child3, typeof xml.Child_elem )",
        "xml = xml.parse( xml.asUTFString(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema3.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"Child3\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema3.Child3, typeof xml.Child_elem )"
    } )
  }

  // the point of this test is that the foreign schema (schema2) needs to be included at validation time, or the validation will fail
  @Test
  function testSubtypeFromForeginNamespace() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "schema", "MyType" )
    schema.ComplexType[0].Name = "MyType"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.ComplexType[0].Name = "MyType2"
    schema2.ComplexType[0].ComplexContent.Restriction.Base = new QName( "schema", "MyType" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$TypeInstance = new $$TESTPACKAGE$$.schema2.types.complex.MyType2()",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType2\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType2, typeof xml.$TypeInstance )",
        "xml = xml.parse( xml.bytes(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType2\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType2, typeof xml.$TypeInstance )",
        "xml = xml.parse( xml.asUTFString(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType2\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType2, typeof xml.$TypeInstance )"
    } )
  }

  @Test
  function testSubtypeFromForeginNamespaceTwiceRemoved() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "schema", "MyType" )
    schema.ComplexType[0].Name = "MyType"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.ComplexType[0].Name = "MyType2"
    schema2.ComplexType[0].ComplexContent.Restriction.Base = new QName( "schema", "MyType" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.Import[0].Namespace = new URI( "schema2" )
    schema3.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.ComplexType[0].Name = "MyType3"
    schema3.ComplexType[0].ComplexContent.Restriction.Base = new QName( "schema2", "MyType2" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$TypeInstance = new $$TESTPACKAGE$$.schema3.types.complex.MyType3()",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType3\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.complex.MyType3, typeof xml.$TypeInstance )",
        "xml = xml.parse( xml.bytes(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema3.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType3\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.complex.MyType3, typeof xml.$TypeInstance )",
        "xml = xml.parse( xml.asUTFString(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema3.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType3\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.complex.MyType3, typeof xml.$TypeInstance )"
    } )
  }

  @Test
  function testRootElementHasSubtypeFromForeignNamespace() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "schema", "MyType" )
    schema.SimpleType[0].Name = "MyType"
    schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "int" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.SimpleType[0].Name = "MyType2"
    schema2.SimpleType[0].Restriction.Base = new QName( "schema", "MyType" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var typeinstance = new $$TESTPACKAGE$$.schema2.types.simple.MyType2()",
        "typeinstance.$Value = 42",
        "xml.$TypeInstance = typeinstance",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType2\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.simple.MyType2, typeof xml.$TypeInstance )",
        "assertEquals( 42, xml.$Value )",
        "xml = xml.parse( xml.bytes(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType2\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.simple.MyType2, typeof xml.$TypeInstance )",
        "assertEquals( 42, xml.$Value )",
        "xml = xml.parse( xml.asUTFString(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertTrue( xml.asUTFString().contains( \"xsi:type=\" ) )",
        "assertTrue( xml.asUTFString().contains( \"MyType2\" ) )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.simple.MyType2, typeof xml.$TypeInstance )",
        "assertEquals( 42, xml.$Value )"
    } )
  }

  @Test
  function testAnySimpleTypeReplacedByBuiltInSimpleTypeAtRuntime() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "anySimpleType" )
    schema.Element[0].Nillable = true

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var typeinstance = new gw.xsd.w3c.xmlschema.types.simple.Int()",
        "xml.$TypeInstance = typeinstance",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlException\" )", // due to missing int value
        "}",
        "catch ( ex : gw.xml.XmlException ) {",
        "  // good",
        "}",
        "xml.$Nil = true",
        "// The schema schema namespace must be included since the xsi:type has to be qualified by it",
        "assertTrue( xml.asUTFString().replace( \"\\\"\", \"'\" ).contains( \"'http://www.w3.org/2001/XMLSchema'\" ) )",
        "xml.$Nil = false",
        "typeinstance.$Value = 42",
        "assertTrue( xml.asUTFString().replace( \"\\\"\", \"'\" ).contains( \"'http://www.w3.org/2001/XMLSchema'\" ))",
        "assertTrue( xml.asUTFString().replace( \"\\\"\", \"'\" ).contains( \"42\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, typeof xml.$TypeInstance )",
        "assertEquals( 42, ( xml.$TypeInstance as gw.xsd.w3c.xmlschema.types.simple.Int ).$Value )"
    } )
  }

  @Test
  function testAnySimpleTypeReplacedByUserDefinedSimpleTypeAtRuntime() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "anySimpleType" )
    schema.Element[0].Nillable = true
    schema.SimpleType[0].Name = "MyType"
    schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var typeinstance = new $$TESTPACKAGE$$.schema.types.simple.MyType()",
        "xml.$TypeInstance = typeinstance",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlException\" )", // due to missing int value
        "}",
        "catch ( ex : gw.xml.XmlException) {",
        "  // good",
        "}",
        "xml.$Nil = true",
        "assertFalse( xml.asUTFString().replace( \"\\\"\", \"'\" ).contains( \"'http://www.w3.org/2001/XMLSchema'\" ) )",
        "xml.$Nil = false",
        "typeinstance.$Value = 42",
        "assertFalse( xml.asUTFString().replace( \"\\\"\", \"'\" ).contains( \"'http://www.w3.org/2001/XMLSchema'\" ) )",
        "assertTrue( xml.asUTFString().replace( \"\\\"\", \"'\" ).contains( \"42\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.MyType, typeof xml.$TypeInstance )",
        "print(xml.$Value)",
        "assertEquals( '42', xml.$Value )"
    } )
  }

  @Test
  function testSerializeXmlElementWithForeignNamespace() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "urn:schema", "child" )
    schema.Element[1].Name = "child"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:schema2" )
    schema2.Import[0].Namespace = new URI( "urn:schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "child2"
    schema2.Element[0].SubstitutionGroup = new QName( "urn:schema", "child" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = new $$TESTPACKAGE$$.schema2.Child2()",
        "xml.print()"
    } )
  }

}