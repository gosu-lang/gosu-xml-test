package gw.xml.xsd.typeprovider

uses gw.internal.xml.XmlConstants
uses javax.xml.namespace.QName
uses java.net.URI
uses gw.xml.XmlException
uses org.junit.Test
uses org.xml.sax.SAXParseException
uses gw.xsd.w3c.xmlschema.Schema
uses java.lang.Throwable
uses java.lang.RuntimeException

class XmlSchemaIncludeTest extends XSDTest {

  @Test
  function testIncludeElementRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Include[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "Child" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Element[0].Name = "Child"
    schema2.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, statictypeof xml.Child_elem.$TypeInstance )"
    } )
  }

  @Test
  function testIncludeSimpleTypeRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Include[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "MyType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.SimpleType[0].Name = "MyType"
    schema2.SimpleType[0].List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.MyType, statictypeof xml.$TypeInstance )"
    } )
  }

  @Test
  function testIncludeComplexTypeRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Include[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = new QName( "MyType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.ComplexType[0].Name = "MyType"

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType, statictypeof xml.$TypeInstance )"
    } )
  }

  @Test
  function testIncludeBackwardsElementRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Include[0].SchemaLocation = new URI( "schema2.xsdi" )
    schema.ComplexType[0].Name = "MyType"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema() // an invalid schema if standalone
    schema2.Element[0].Name = "Root"
    schema2.Element[0].Type = new QName( "MyType" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, { "schema.xsd", "schema2.xsdi" }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType, statictypeof xml.$TypeInstance )"
    })
  }

  @Test
  function testIncludeBackwardsSimpleTypeRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Include[0].SchemaLocation = new URI( "schema2.xsdi" )
    schema.SimpleType[0].Name = "MyType"
    schema.SimpleType[0].List.ItemType = schema.$Namespace.qualify( "int" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema() // an invalid schema if standalone
    schema2.Element[0].Name = "Root"
    schema2.Element[0].Type = new QName( "MyType" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, { "schema.xsd", "schema2.xsdi"}, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.MyType, statictypeof xml.$TypeInstance )"
    })
  }

  @Test
  function testIncludeBackwardsComplexTypeRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Include[0].SchemaLocation = new URI( "schema2.xsdi" )
    schema.ComplexType[0].Name = "MyType"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Element[0].Name = "Root"
    schema2.Element[0].Type = new QName( "MyType" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, { "schema.xsd", "schema2.xsdi"}, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType, statictypeof xml.$TypeInstance )"
    })
  }

  @Test
  function testIncludeOfSchemaWithImportAndNoSchemaLocationImportInMainSchema() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Import[0].Namespace = new URI( "urn:schema3" )
    schema.Include[0].SchemaLocation = new URI( "schema2.xsdi" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "urn:schema3", "rootType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Import[0].Namespace = new URI( "urn:schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "urn:schema3" )
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, { "schema.xsd", "schema2.xsdi", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( 5, xml.Child )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Child )"
    })
  }

  @Test
  function testIncludeOfSchemaWithImportAndSchemaLocationImportInMainSchema() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Import[0].Namespace = new URI( "urn:schema3" )
    schema.Import[0].SchemaLocation = new URI( "schema3.xsd" )
    schema.Include[0].SchemaLocation = new URI( "schema2.xsdi" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Import[0].Namespace = new URI( "urn:schema3" )
    schema2.Element[0].Name = "root"
    schema2.Element[0].Type = new QName( "urn:schema3", "rootType" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "urn:schema3" )
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, { "schema.xsd", "schema2.xsdi", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( 5, xml.Child )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Child )"
    })
  }

  @Test
  function testIncludeOfSchemaWithImportAndNoImportInMainSchema() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Include[0].SchemaLocation = new URI( "schema2.xsdi" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "urn:schema3", "rootType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Import[0].Namespace = new URI( "urn:schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "urn:schema3" )
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    // This used to fail prior to adding the schema-simplification prior to schema-compilation, not sure why.
    // It should pass since the included schema contains the import, so the import gets included
    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, { "schema.xsd", "schema2.xsdi", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( 5, xml.Child )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Child )"
    })
  }

  @Test
  function testIncludeOfSchemaWithNoImportAndImportInMainSchema() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Include[0].SchemaLocation = new URI( "schema2.xsdi" )
    schema.Import[0].Namespace = new URI( "urn:schema3" )
    schema.Import[0].SchemaLocation = new URI( "schema3.xsd" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Element[0].Name = "root"
    schema2.Element[0].Type = new QName( "urn:schema3", "rootType" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "urn:schema3" )
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    // This used to fail prior to adding the schema-simplification prior to schema-compilation, not sure why.
    // It should pass since the included schema is inlined into the including schema, therefore the import affects its components
    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, { "schema.xsd", "schema2.xsdi", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( 5, xml.Child )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Child )"
    })
  }

  @Test
  function testSchemaWithDuplicateImportsInSequenceWithFirstMissingSchemaLocation() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Import[0].Namespace = new URI( "urn:schema2" )
    schema.Import[1].Namespace = new URI( "urn:schema2" )
    schema.Import[1].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "urn:schema2", "rootType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:schema2" )
    schema2.ComplexType[0].Name = "rootType"
    schema2.ComplexType[0].Sequence.Element[0].Name = "child"
    schema2.ComplexType[0].Sequence.Element[0].Type = schema2.$Namespace.qualify( "int" )

    // this used to cause an error, but now works as intended
    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, { "schema.xsd", "schema2.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( 5, xml.Child )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Child )"
    })
  }

  @Test
  function testSchemaWithDuplicateImportsInSequenceWithSecondMissingSchemaLocation() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Import[0].Namespace = new URI( "urn:schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[1].Namespace = new URI( "urn:schema2" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "urn:schema2", "rootType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:schema2" )
    schema2.ComplexType[0].Name = "rootType"
    schema2.ComplexType[0].Sequence.Element[0].Name = "child"
    schema2.ComplexType[0].Sequence.Element[0].Type = schema2.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, { "schema.xsd", "schema2.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( 5, xml.Child )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Child )"
    })
  }

  @Test
  function testSchemaWithIncludeWithInclude_UsesCorrectBaseUrl() {
    var schema1 = new Schema()
    schema1.Include[0].SchemaLocation = new URI( "subdir/schema2.xsd" )
    schema1.Element[0].Name = "root"
    schema1.Element[0].Type = new QName( "rootType" )

    var schema2 = new Schema()
    schema2.Include[0].SchemaLocation = new URI( "../schema3.xsd" )

    var schema3 = new Schema()
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema1, schema2, schema3 }, { "schema1.xsd", "subdir/schema2.xsd", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema1.Root()",
        "xml.Child = 5"
    } )
  }

  @Test
  function testSchemaWithIncludeWithRedefine_UsesCorrectBaseUrl() {
    var schema1 = new Schema()
    schema1.Include[0].SchemaLocation = new URI( "subdir/schema2.xsd" )
    schema1.Element[0].Name = "root"
    schema1.Element[0].Type = new QName( "rootType" )

    var schema2 = new Schema()
    schema2.Redefine[0].SchemaLocation = new URI( "../schema3.xsd" )

    var schema3 = new Schema()
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema1, schema2, schema3 }, { "schema1.xsd", "subdir/schema2.xsd", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema1.Root()",
        "xml.Child = 5"
    } )
  }

  @Test
  function testSchemaWithIncludeWithImport_UsesCorrectBaseUrl() {
    var schema1 = new Schema()
    schema1.Import[0].Namespace = new URI( "urn:schema3" )
    schema1.Include[0].SchemaLocation = new URI( "subdir/schema2.xsd" )
    schema1.Element[0].Name = "root"
    schema1.Element[0].Type = new QName( "urn:schema3", "rootType" )

    var schema2 = new Schema()
    schema2.Import[0].Namespace = new URI( "urn:schema3" )
    schema2.Import[0].SchemaLocation = new URI( "../schema3.xsd" )

    var schema3 = new Schema()
    schema3.TargetNamespace = new URI( "urn:schema3" )
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema1, schema2, schema3 }, { "schema1.xsd", "subdir/schema2.xsd", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema1.Root()",
        "xml.Child = 5"
    } )
  }

  @Test
  function testSchemaWithRedefineWithInclude_UsesCorrectBaseUrl() {
    var schema1 = new Schema()
    schema1.Redefine[0].SchemaLocation = new URI( "subdir/schema2.xsd" )
    schema1.Element[0].Name = "root"
    schema1.Element[0].Type = new QName( "rootType" )

    var schema2 = new Schema()
    schema2.Include[0].SchemaLocation = new URI( "../schema3.xsd" )

    var schema3 = new Schema()
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema1, schema2, schema3 }, { "schema1.xsd", "subdir/schema2.xsd", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema1.Root()",
        "xml.Child = 5"
    } )
  }

  @Test
  function testSchemaWithRedefineWithRedefine_UsesCorrectBaseUrl() {
    var schema1 = new Schema()
    schema1.Redefine[0].SchemaLocation = new URI( "subdir/schema2.xsd" )
    schema1.Element[0].Name = "root"
    schema1.Element[0].Type = new QName( "rootType" )

    var schema2 = new Schema()
    schema2.Redefine[0].SchemaLocation = new URI( "../schema3.xsd" )

    var schema3 = new Schema()
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema1, schema2, schema3 }, { "schema1.xsd", "subdir/schema2.xsd", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema1.Root()",
        "xml.Child = 5"
    } )
  }

  @Test
  function testSchemaWithRedefineWithImport_UsesCorrectBaseUrl() {
    var schema1 = new Schema()
    schema1.Import[0].Namespace = new URI( "urn:schema3" )
    schema1.Redefine[0].SchemaLocation = new URI( "subdir/schema2.xsd" )
    schema1.Element[0].Name = "root"
    schema1.Element[0].Type = new QName( "urn:schema3", "rootType" )

    var schema2 = new Schema()
    schema2.Import[0].Namespace = new URI( "urn:schema3" )
    schema2.Import[0].SchemaLocation = new URI( "../schema3.xsd" )

    var schema3 = new Schema()
    schema3.TargetNamespace = new URI( "urn:schema3" )
    schema3.ComplexType[0].Name = "rootType"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema1, schema2, schema3 }, { "schema1.xsd", "subdir/schema2.xsd", "schema3.xsd" }, {
        "var xml = new $$TESTPACKAGE$$.schema1.Root()",
        "xml.Child = 5"
    } )
  }

  // This test uses 3 schemas in order to trigger usage of schema cache
  @Test
  function testIncludeTriggersCacheAndMaintainsFunctionality() {
    var testCaseCount = 0
    var includedNamespaces : List<String> = { null, "urn:schema1", XmlConstants.NULL_NS_URI }
    var includer1Namespaces : List<String> = { null, "urn:schema1", "urn:schema2", XmlConstants.NULL_NS_URI }
    var includer2Namespaces : List<String> = { null, "urn:schema1", "urn:schema2", XmlConstants.NULL_NS_URI }

    // There are 48 namespace combinations between the 3 schemas. Not all of them are needed for testing purpose, but kept this way to simplify the algorithm.
    for ( includedNamespace in includedNamespaces ) {
      for ( includer1Namespace in includer1Namespaces ) {
        for ( includer2Namespace in includer2Namespaces ) {
          testCaseCount++
          var schema = new Schema()
          schema.TargetNamespace = XmlSchemaTestUtil.toURI( includer1Namespace )
          schema.Include[0].SchemaLocation = new URI( "schema3.xsd" )
          schema.Element[0].Name = "Root"
          schema.Element[0].Type = new QName( includer1Namespace, "MyType", "myns" )

          var schema2 = new Schema()
          schema2.TargetNamespace = XmlSchemaTestUtil.toURI( includer2Namespace )
          schema2.Include[0].SchemaLocation = new URI ( "schema3.xsd" )
          schema2.Element[0].Name = "Root"
          schema2.Element[0].Type = new QName( includer2Namespace, "MyType", "myns" )

          var schema3 = new Schema()
          schema3.TargetNamespace = XmlSchemaTestUtil.toURI( includedNamespace )
          schema3.ComplexType[0].Name = "MyType"
          schema3.ComplexType[0].Sequence.Element[0].Name = "child"
          schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify("int")

          if ( includedNamespace != null and includedNamespace != "" and (
              not XmlSchemaTestUtil.namespacesEqual( includedNamespace, includer1Namespace ) or
                  not XmlSchemaTestUtil.namespacesEqual( includedNamespace, includer2Namespace ) ) ) {
            // expect exception
            try {
              XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {} as String[] )
              fail( "Expected XmlException" )
            }
            catch ( ex : XmlException ) {
              // good
              assertEquals( XmlException, typeof ex.Cause )
              // src-include.2.1: The targetNamespace of the referenced schema, currently 'urn:schema1', must be identical to that of the including schema, currently 'null'
              assertTrue(ex.Cause.Message.startsWith("src-include.2.1:"))
            }
          }
          else {
            var usesCache : boolean
            if ( XmlSchemaTestUtil.namespacesEqual( includer1Namespace, includer2Namespace ) ) {
              // uses cache
              usesCache = true
            }
            else {
              // does not use cache
              usesCache = false
            }
            try {
              XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, { "schema.xsd", "schema2.xsd", "schema3.xsd" }, {
                  "assertEquals( '${includer1Namespace == null ? "" : includer1Namespace}', $$TESTPACKAGE$$.schema.Root.$QNAME.NamespaceURI )",
                  "assertEquals( '${includer2Namespace == null ? "" : includer2Namespace}', $$TESTPACKAGE$$.schema2.Root.$QNAME.NamespaceURI )",
                  "var xml = new $$TESTPACKAGE$$.schema.Root()",
                  "assertEquals(java.lang.Integer, (statictypeof xml.Child))",
                  "var xml2 = new $$TESTPACKAGE$$.schema2.Root()",
                  "assertEquals(java.lang.Integer, (statictypeof xml2.Child))"
              } )
            }
            catch ( t : Throwable ) {
              throw new RuntimeException( "Test case failed. Included namespace: ${includedNamespace}, Includer1 Namespace: ${includer1Namespace}, Includer2 Namespace: ${includer2Namespace}", t )
            }
          }
        }
      }
    }
  }
}