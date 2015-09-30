package gw.xml.xsd.typeprovider

uses gw.internal.xml.XmlConstants
uses java.net.URI
uses javax.xml.namespace.QName
uses gw.xsd.w3c.xmlschema.Schema
uses gw.xml.XmlException
uses org.junit.Test
uses org.xml.sax.SAXParseException
uses java.lang.Throwable
uses java.lang.RuntimeException

class XmlSchemaRedefineTest extends XSDTest {

  // chameleon transformation dimension
  final var NAMESPACES : String[][] = { { "", "" }, { "", "urn:schema" }, { "urn:schema", "urn:schema" } }


  @Test
  function testRedefinedTypesCannotBeConstructed() {
    for ( namespace in NAMESPACES ) {

      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.SimpleType[0].Name = "MyType"
      schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "int" )

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].SimpleType[0].Name = "MyType"
      schema2.Redefine[0].SimpleType[0].Restriction.Base = new QName( namespace[1], "MyType" )

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "assertTrue( $$TESTPACKAGE$$.schema2.types.simple.Redefine0.Type.TypeInfo.Constructors.Empty )",
          "assertFalse( $$TESTPACKAGE$$.schema2.types.simple.MyType.Type.TypeInfo.Constructors.Empty )"
      } )
    }
  }


  @Test
  function testRedefineSimpleType() {
    for ( namespace in NAMESPACES ) {

      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.SimpleType[0].Name = "MyType"
      schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "int" )
      schema.SimpleType[0].Restriction.MinInclusive[0].Value = "5"

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].SimpleType[0].Name = "MyType"
      schema2.Redefine[0].SimpleType[0].Restriction.Base = new QName( namespace[1], "MyType" )
      schema2.Redefine[0].SimpleType[0].Restriction.MaxInclusive[0].Value = "10"

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new $$TESTPACKAGE$$.schema2.types.simple.MyType()",
          "try {",
          "  xml.$Value = 4",
          "  fail( \"Expected XmlSimpleValueException\" )",
          "}",
          "catch ( ex : gw.xml.XmlSimpleValueException ) {",
          "  // good",
          "}",
          "xml.$Value = 5",
          "xml.$Value = 10",
          "try {",
          "  xml.$Value = 11",
          "  fail( \"Expected XmlSimpleValueException\" )",
          "}",
          "catch ( ex : gw.xml.XmlSimpleValueException ) {",
          "  // good",
          "}",
          "assertEquals( $$TESTPACKAGE$$.schema2.types.simple.Redefine0, $$TESTPACKAGE$$.schema2.types.simple.MyType.Type.Supertype )",
          "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, $$TESTPACKAGE$$.schema2.types.simple.Redefine0.Type.Supertype )"
      } )
    }
  }

  @Test
  function testRedefineComplexType() {
    for ( namespace in NAMESPACES ) {

      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.ComplexType[0].Name = "MyType"
      schema.ComplexType[0].Sequence.Element[0].Name = "Elem1"
      schema.ComplexType[0].Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].ComplexType[0].Name = "MyType"
      schema2.Redefine[0].ComplexType[0].ComplexContent.Extension.Base = new QName( namespace[1], "MyType" )
      schema2.Redefine[0].ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Name = "Elem2"
      schema2.Redefine[0].ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new $$TESTPACKAGE$$.schema2.types.complex.MyType()",
          "xml.Elem1 = 5",
          "xml.Elem2 = 10",
          "assertEquals( 5, xml.Elem1_elem.$Value )",
          "assertEquals( 10, xml.Elem2_elem.$Value )",
          "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.Redefine0, $$TESTPACKAGE$$.schema2.types.complex.MyType.Type.Supertype )",
          "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, $$TESTPACKAGE$$.schema2.types.complex.Redefine0.Type.Supertype )"
      } )
    }
  }

  @Test
  function testRedefineSimpleTypeAsComplexTypeWithSimpleContent() {
    for ( namespace in NAMESPACES ) {

      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.SimpleType[0].Name = "MyType"
      schema.SimpleType[0].Restriction.Base = schema.$Namespace.qualify( "int" )

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].ComplexType[0].Name = "MyType"
      schema2.Redefine[0].ComplexType[0].SimpleContent.Extension.Base = new QName( namespace[1], "MyType" )
      schema2.Redefine[0].ComplexType[0].SimpleContent.Extension.Attribute[0].Name = "Attr"
      schema2.Redefine[0].ComplexType[0].SimpleContent.Extension.Attribute[0].Type = schema.$Namespace.qualify( "int" )

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new $$TESTPACKAGE$$.schema2.types.complex.MyType()",
          "xml.$Value = 5",
          "xml.Attr = 10",
          "assertEquals( 5, xml.$Value )",
          "assertEquals( 10, xml.Attr )",
          "assertEquals( $$TESTPACKAGE$$.schema2.types.simple.Redefine0, $$TESTPACKAGE$$.schema2.types.complex.MyType.Type.Supertype )",
          "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, $$TESTPACKAGE$$.schema2.types.simple.Redefine0.Type.Supertype )"
      } )
    }
  }


  @Test
  function testRedefineAttributeGroupWithSubset() {
    for ( namespace in NAMESPACES ) {

      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.Element[0].Name = "root"
      schema.Element[0].ComplexType.AttributeGroup[0].Ref = new QName( namespace[0], "AttrGroup" )
      schema.AttributeGroup[0].Name = "AttrGroup"
      schema.AttributeGroup[0].Attribute[0].Name = "Attr1"
      schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
      schema.AttributeGroup[0].Attribute[1].Name = "Attr2"
      schema.AttributeGroup[0].Attribute[1].Type = schema.$Namespace.qualify( "int" )
      schema.AttributeGroup[0].Attribute[2].Name = "Attr3"
      schema.AttributeGroup[0].Attribute[2].Type = schema.$Namespace.qualify( "int" )

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].AttributeGroup[0].Name = "AttrGroup"
      schema2.Redefine[0].AttributeGroup[0].Attribute[0].Name = "Attr1"
      schema2.Redefine[0].AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
      schema2.Redefine[0].AttributeGroup[0].Attribute[1].Name = "Attr2"
      schema2.Redefine[0].AttributeGroup[0].Attribute[1].Type = schema.$Namespace.qualify( "int" )

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new $$TESTPACKAGE$$.schema2.Root()",
          "xml.Attr1 = 5",
          "xml.Attr2 = 10",
          "assertEquals( 5, xml.Attr1 )",
          "assertEquals( 10, xml.Attr2 )",
          "assertNotNull( $$TESTPACKAGE$$.schema2.Root.Type.TypeInfo.getProperty( \"Attr1\" ) )",
          "assertNotNull( $$TESTPACKAGE$$.schema2.Root.Type.TypeInfo.getProperty( \"Attr2\" ) )",
          "assertNull( $$TESTPACKAGE$$.schema2.Root.Type.TypeInfo.getProperty( \"Attr3\" ) )"
      } )
    }
  }

  @Test
  function testRedefineAttributeGroupWithSuperset() {
    for ( namespace in NAMESPACES ) {
      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.Element[0].Name = "root"
      schema.Element[0].ComplexType.AttributeGroup[0].Ref = new QName( namespace[0], "AttrGroup" )
      schema.AttributeGroup[0].Name = "AttrGroup"
      schema.AttributeGroup[0].Attribute[0].Name = "Attr1"
      schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
      schema.AttributeGroup[0].Attribute[1].Name = "Attr2"
      schema.AttributeGroup[0].Attribute[1].Type = schema.$Namespace.qualify( "int" )
      schema.AttributeGroup[0].Attribute[2].Name = "Attr3"
      schema.AttributeGroup[0].Attribute[2].Type = schema.$Namespace.qualify( "int" )

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].AttributeGroup[0].Name = "AttrGroup"
      schema2.Redefine[0].AttributeGroup[0].AttributeGroup[0].Ref = new QName( namespace[1], "AttrGroup" )
      schema2.Redefine[0].AttributeGroup[0].Attribute[0].Name = "Attr4"
      schema2.Redefine[0].AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new $$TESTPACKAGE$$.schema2.Root()",
          "xml.Attr1 = 5",
          "xml.Attr2 = 10",
          "xml.Attr3 = 15",
          "xml.Attr4 = 20",
          "assertEquals( 5, xml.Attr1 )",
          "assertEquals( 10, xml.Attr2 )",
          "assertEquals( 15, xml.Attr3 )",
          "assertEquals( 20, xml.Attr4 )"
      } )
    }
  }

  @Test
  function testRedefineGroupWithSubset() {
    for ( namespace in NAMESPACES ) {

      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.Element[0].Name = "root"
      schema.Element[0].ComplexType.Sequence.Group[0].Ref = new QName( namespace[0], "MyGroup" )
      schema.Group[0].Name = "MyGroup"
      schema.Group[0].Choice.Element[0].Ref = new QName( namespace[0], "El1" )
      schema.Group[0].Choice.Element[1].Ref = new QName( namespace[0], "El2" )
      schema.Group[0].Choice.Element[2].Ref = new QName( namespace[0], "El3" )
      schema.Element[1].Name = "El1"
      schema.Element[1].Type = schema.$Namespace.qualify( "int" )
      schema.Element[2].Name = "El2"
      schema.Element[2].Type = schema.$Namespace.qualify( "int" )
      schema.Element[3].Name = "El3"
      schema.Element[3].Type = schema.$Namespace.qualify( "int" )

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].Group[0].Name = "MyGroup"
      schema2.Redefine[0].Group[0].Choice.Element[0].Ref = new QName( namespace[1], "El1" )
      schema2.Redefine[0].Group[0].Choice.Element[1].Ref = new QName( namespace[1], "El2" )

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new $$TESTPACKAGE$$.schema2.Root()",
          "xml.El1 = 5",
          "xml.El2 = 10",
          "assertEquals( 5, xml.El1 )",
          "assertEquals( 10, xml.El2 )",
          "assertNotNull( $$TESTPACKAGE$$.schema2.Root.Type.TypeInfo.getProperty( \"El1\" ) )",
          "assertNotNull( $$TESTPACKAGE$$.schema2.Root.Type.TypeInfo.getProperty( \"El2\" ) )",
          "assertNull( $$TESTPACKAGE$$.schema2.Root.Type.TypeInfo.getProperty( \"El3\" ) )"
      } )
    }
  }


  @Test
  function testRedefineGroupWithSuperset() {
    for ( namespace in NAMESPACES ) {
      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.TargetNamespace = new URI( namespace[0] )
      schema.Element[0].Name = "root"
      schema.Element[0].ComplexType.Sequence.Group[0].Ref = new QName( namespace[0], "MyGroup" )
      schema.Group[0].Name = "MyGroup"
      schema.Group[0].Choice.Element[0].Ref = new QName( namespace[0], "El1" )
      schema.Group[0].Choice.Element[1].Ref = new QName( namespace[0], "El2" )
      schema.Group[0].Choice.Element[2].Ref = new QName( namespace[0], "El3" )
      schema.Element[1].Name = "El1"
      schema.Element[1].Type = schema.$Namespace.qualify( "int" )
      schema.Element[2].Name = "El2"
      schema.Element[2].Type = schema.$Namespace.qualify( "int" )
      schema.Element[3].Name = "El3"
      schema.Element[3].Type = schema.$Namespace.qualify( "int" )

      var schema2 = new gw.xsd.w3c.xmlschema.Schema()
      schema2.TargetNamespace = new URI( namespace[1] )
      schema2.Element[0].Name = "El4"
      schema2.Element[0].Type = schema.$Namespace.qualify( "int" )
      schema2.Redefine[0].SchemaLocation = new URI( "schema.xsd" )
      schema2.Redefine[0].Group[0].Name = "MyGroup"
      schema2.Redefine[0].Group[0].Choice.Group[0].Ref = new QName( namespace[1], "MyGroup" )
      schema2.Redefine[0].Group[0].Choice.Element[0].Ref = new QName( namespace[1], "El4" )

      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new $$TESTPACKAGE$$.schema2.Root()",
          "xml.El1 = 5",
          "xml.El2 = 10",
          "xml.El3 = 15",
          "xml.El4 = 20",
          "assertEquals( 5, xml.El1 )",
          "assertEquals( 10, xml.El2 )",
          "assertEquals( 15, xml.El3 )",
          "assertEquals( 20, xml.El4 )"
      } )
    }
  }

  @Test
  function testRedefine_ChameleonTransformation() {
    var testCaseCount = 0
    var includedNamespaces : List<String> = { null, "urn:schema1", XmlConstants.NULL_NS_URI }
    var includer1Namespaces : List<String> = { null, "urn:schema1", "urn:schema2", XmlConstants.NULL_NS_URI }
    var includer2Namespaces : List<String> = { null, "urn:schema1", "urn:schema2", XmlConstants.NULL_NS_URI }

    for ( includedNamespace in includedNamespaces ) {
      for ( includer1Namespace in includer1Namespaces ) {
        for ( includer2Namespace in includer2Namespaces ) {
          testCaseCount++
          var schema = new Schema()
          schema.TargetNamespace = XmlSchemaTestUtil.toURI( includer1Namespace )
          schema.Include[0].SchemaLocation = new URI( "schema3.xsd" )
          schema.Element[0].Name = "Root"
          schema.Element[0].Type = new QName( includer1Namespace, "MyType", "myns" )

          schema.Redefine[0].SchemaLocation = new URI( "schema3.xsd" )
          schema.Redefine[0].ComplexType[0].Name = "MyType"
          schema.Redefine[0].ComplexType[0].ComplexContent.Extension.Base = new QName( includer1Namespace, "MyType", "myns" )
          schema.Redefine[0].ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Name = "ID"
          schema.Redefine[0].ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Type = schema.$Namespace.qualify( "string" )

          var schema2 = new Schema()
          schema2.TargetNamespace = XmlSchemaTestUtil.toURI( includer2Namespace )
          schema2.Include[0].SchemaLocation = new URI ( "schema3.xsd" )
          schema2.Element[0].Name = "Root"
          schema2.Element[0].Type = new QName( includer2Namespace, "MyType", "myns" )
          schema2.Redefine[0].SchemaLocation = new URI( "schema3.xsd" )
          schema2.Redefine[0].ComplexType[0].Name = "MyType"
          schema2.Redefine[0].ComplexType[0].ComplexContent.Extension.Base = new QName( includer2Namespace, "MyType", "myns" )
          schema2.Redefine[0].ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Name = "ID"
          schema2.Redefine[0].ComplexType[0].ComplexContent.Extension.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

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
              assertTrue( ex.Cause.Message.startsWith("src-include.2.1:") )
            }
          }
          else {
            try {
              XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, { "schema.xsd", "schema2.xsd", "schema3.xsd" }, {
                  "assertEquals( '${includer1Namespace == null ? "" : includer1Namespace}', $$TESTPACKAGE$$.schema.Root.$QNAME.NamespaceURI )",
                  "assertEquals( '${includer2Namespace == null ? "" : includer2Namespace}', $$TESTPACKAGE$$.schema2.Root.$QNAME.NamespaceURI )",
                  "var xml = new $$TESTPACKAGE$$.schema.Root()",
                  "var xml2= new $$TESTPACKAGE$$.schema2.Root()",
                  "assertEquals(java.lang.String, statictypeof(xml.ID))",
                  "assertEquals(java.lang.Integer, statictypeof(xml2.ID))"
              } )
            } catch ( t : Throwable ) {
              throw new RuntimeException( "Test case failed. Included namespace: ${includedNamespace}, Includer1 Namespace: ${includer1Namespace}, Includer2 Namespace: ${includer2Namespace}", t )
            }
          }
        }
      }
    }
  }
}