package gw.xml.xsd.typeprovider

uses java.net.URI
uses javax.xml.namespace.QName
uses gw.internal.xml.xsd.typeprovider.XmlSchemaIndex
uses gw.xml.XmlException
uses gw.xsd.w3c.xmlschema.Schema
uses org.junit.Ignore
uses org.junit.Test

class XmlSchemaImportTest extends XSDTest {

  @Test
  @Ignore("Not sure why this is failing")
  function testXsdResourceExternalLocationMapping() {
    // Testing the 3 mappings defined in ..\ws\platform\webservices\config\xsd\schemalocations.xml
    assertEquals(XmlSchemaIndex.getSchemaIndexByType( gw.xsd.w3c.xmlschema.Schema ).ExternalLocationForTesting, "http://www.w3.org/2001/XMLSchema.xsd")
    var xml = new gw.xsd.w3c.xmlschema.Schema()
    assertEquals("http://www.w3.org/2001/XMLSchema", xml.$Namespace.NamespaceURI)

    assertEquals(XmlSchemaIndex.getSchemaIndexByType(gw.xsd.w3c.xml.anonymous.types.simple.Lang).ExternalLocationForTesting, "http://www.w3.org/2001/xml.xsd")

    assertEquals(XmlSchemaIndex.getSchemaIndexByType(gw.xsd.w3c.wsdl.Definitions).ExternalLocationForTesting, "http://schemas.xmlsoap.org/wsdl/")
    var wsdl = new gw.xsd.w3c.wsdl.Definitions()
    assertEquals(wsdl.$Namespace.NamespaceURI, "http://schemas.xmlsoap.org/wsdl/")
  }

  @Test
  function testImportedElementRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "schema2", "Child" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Element[0].Name = "Child"
    schema2.Element[0].Type = schema2.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, typeof xml.$TypeInstance )",
        "assertEquals( java.lang.Integer, statictypeof xml.Child )",
        "assertEquals( java.lang.Integer, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Child, typeof xml.Child_elem )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, statictypeof xml.Child_elem.$TypeInstance )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, typeof xml.Child_elem.$TypeInstance )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, typeof xml.$TypeInstance )",
        "assertEquals( java.lang.Integer, statictypeof xml.Child )",
        "assertEquals( java.lang.Integer, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Child, typeof xml.Child_elem )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, statictypeof xml.Child_elem.$TypeInstance )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int, typeof xml.Child_elem.$TypeInstance )"
    } )
  }

  @Test
  function testImportedTypeRef() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = new QName( "schema2", "MyType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.ComplexType[0].Name = "MyType"
    schema2.ComplexType[0].SimpleContent.Extension.Base = schema2.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, typeof xml.$TypeInstance )",
        "assertEquals( java.lang.Integer, statictypeof xml.Child )",
        "assertEquals( java.lang.Integer, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, statictypeof xml.Child_elem.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, typeof xml.Child_elem.$TypeInstance )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Root, typeof xml.$TypeInstance )",
        "assertEquals( java.lang.Integer, statictypeof xml.Child )",
        "assertEquals( java.lang.Integer, typeof xml.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, statictypeof xml.Child_elem.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType, typeof xml.Child_elem.$TypeInstance )"
    } )
  }

  @Test
  function testCircularImport(){

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Element1"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "schema2", "Element2" )
    schema.Element[0].ComplexType.Sequence.Element[0].MinOccurs = 0

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Element[0].Name = "Element2"
    schema2.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "schema", "Element1" )
    schema2.Element[0].ComplexType.Sequence.Element[0].MinOccurs = 0

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Element1()",
        "xml.Element2.Element1.Element2.Element1.Element2.Element1.Element2.Element1.Element2 = new $$TESTPACKAGE$$.schema2.Element2()",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, typeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, statictypeof xml.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, typeof xml.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, statictypeof xml.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, typeof xml.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, statictypeof xml.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, typeof xml.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, statictypeof xml.Element2.Element1.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, typeof xml.Element2.Element1.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, statictypeof xml.Element2.Element1.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, typeof xml.Element2.Element1.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, statictypeof xml.Element2.Element1.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, typeof xml.Element2.Element1.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, statictypeof xml.Element2.Element1.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, typeof xml.Element2.Element1.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, statictypeof xml.Element2.Element1.Element2.Element1.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, typeof xml.Element2.Element1.Element2.Element1.$TypeInstance )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, typeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, statictypeof xml.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, typeof xml.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, statictypeof xml.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, typeof xml.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, statictypeof xml.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, typeof xml.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, statictypeof xml.Element2.Element1.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, typeof xml.Element2.Element1.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, statictypeof xml.Element2.Element1.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.Element2, typeof xml.Element2.Element1.Element2 )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, statictypeof xml.Element2.Element1.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.anonymous.types.complex.Element2, typeof xml.Element2.Element1.Element2.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, statictypeof xml.Element2.Element1.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.Element1, typeof xml.Element2.Element1.Element2.Element1 )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, statictypeof xml.Element2.Element1.Element2.Element1.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.types.complex.Element1, typeof xml.Element2.Element1.Element2.Element1.$TypeInstance )"
    } )
  }

  @Test
  function testElementThatImportsGroupThatImportsType() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.ComplexType[0].Name = "MyType"
    schema.ComplexType[0].Sequence.Element[0].Name = "Child"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.Group[0].Name = "MyGroup"
    schema2.Group[0].Sequence.Element[0].Name = "MyElement"
    schema2.Group[0].Sequence.Element[0].Type = new QName( "schema", "MyType" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.Import[0].Namespace = new URI( "schema2" )
    schema3.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema3.Element[0].Name = "Root"
    schema3.Element[0].ComplexType.Sequence.Group[0].Ref = new QName( "schema2", "MyGroup" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var xml = new $$TESTPACKAGE$$.schema3.Root()",
        "xml.MyElement.Child = new $$TESTPACKAGE$$.schema.anonymous.elements.MyType_Child()",
        "assertEquals( $$TESTPACKAGE$$.schema3.Root, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema3.Root, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.types.complex.Root, typeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.types.complex.Root, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.elements.Root_MyElement, typeof xml.MyElement )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.elements.Root_MyElement, statictypeof xml.MyElement )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType, typeof xml.MyElement.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType, statictypeof xml.MyElement.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.MyType_Child, typeof xml.MyElement.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.MyType_Child, statictypeof xml.MyElement.Child )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, typeof xml.MyElement.Child.$TypeInstance )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, statictypeof xml.MyElement.Child.$TypeInstance )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema3.Root, typeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema3.Root, statictypeof xml )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.types.complex.Root, typeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.types.complex.Root, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.elements.Root_MyElement, typeof xml.MyElement )",
        "assertEquals( $$TESTPACKAGE$$.schema3.anonymous.elements.Root_MyElement, statictypeof xml.MyElement )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType, typeof xml.MyElement.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType, statictypeof xml.MyElement.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.MyType_Child, typeof xml.MyElement.Child )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.MyType_Child, statictypeof xml.MyElement.Child )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, typeof xml.MyElement.Child.$TypeInstance )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, statictypeof xml.MyElement.Child.$TypeInstance )"
    } )
  }

  @Test
  function testComplexTypeHierarchyAcrossImportedSchemas() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.ComplexType[0].Name = "MyType"
    schema.ComplexType[0].ComplexContent.Restriction.Base = new QName( "schema2", "MyType" )
    schema.ComplexType[1].Name = "BaseType"
    schema.ComplexType[1].ComplexContent.Restriction.Base = new QName( "schema2", "BaseType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )
    schema2.ComplexType[0].Name = "MyType"
    schema2.ComplexType[0].ComplexContent.Restriction.Base = new QName( "schema3", "MyType" )
    schema2.ComplexType[1].Name = "BaseType"
    schema2.ComplexType[1].ComplexContent.Restriction.Base = new QName( "schema3", "BaseType" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.Import[0].Namespace = new URI( "schema" )
    schema3.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema3.ComplexType[0].Name = "MyType"
    schema3.ComplexType[0].ComplexContent.Restriction.Base = new QName( "schema", "BaseType" )
    schema3.ComplexType[1].Name = "BaseType"

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var type = $$TESTPACKAGE$$.schema.types.complex.MyType",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.MyType,                    type )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.MyType,                   type.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.complex.MyType,                   type.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.BaseType,                  type.Supertype.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.BaseType,                 type.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.complex.BaseType,                 type.Supertype.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, type.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype )"
    } )

  }

  @Test
  function testSimpleTypeHierarchyAcrossImportedSchemas() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.SimpleType[0].Name = "MyType"
    schema.SimpleType[0].Restriction.Base = new QName( "schema2", "MyType" )
    schema.SimpleType[1].Name = "BaseType"
    schema.SimpleType[1].Restriction.Base = new QName( "schema2", "BaseType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )
    schema2.SimpleType[0].Name = "MyType"
    schema2.SimpleType[0].Restriction.Base = new QName( "schema3", "MyType" )
    schema2.SimpleType[1].Name = "BaseType"
    schema2.SimpleType[1].Restriction.Base = new QName( "schema3", "BaseType" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.Import[0].Namespace = new URI( "schema" )
    schema3.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema3.SimpleType[0].Name = "MyType"
    schema3.SimpleType[0].Restriction.Base = new QName( "schema", "BaseType" )
    schema3.SimpleType[1].Name = "BaseType"
    schema3.SimpleType[1].Restriction.Base = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var type = $$TESTPACKAGE$$.schema.types.simple.MyType",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.MyType,                          type )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.simple.MyType,                         type.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.simple.MyType,                         type.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.simple.BaseType,                        type.Supertype.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.simple.BaseType,                       type.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.simple.BaseType,                       type.Supertype.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Int,           type.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Long,          type.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Integer,       type.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.Decimal,       type.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.simple.AnySimpleType, type.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType,      type.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype.Supertype )"
    } )

  }

  @Test
  function testElementHierarchyAcrossImportedSchemasWithSubstitutionGroup() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "MyElement"
    schema.Element[0].SubstitutionGroup = new QName( "schema2", "MyElement" )
    schema.Element[1].Name = "BaseElement"
    schema.Element[1].SubstitutionGroup = new QName( "schema2", "BaseElement" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )
    schema2.Element[0].Name = "MyElement"
    schema2.Element[0].SubstitutionGroup = new QName( "schema3", "MyElement" )
    schema2.Element[1].Name = "BaseElement"
    schema2.Element[1].SubstitutionGroup = new QName( "schema3", "BaseElement" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.Import[0].Namespace = new URI( "schema" )
    schema3.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema3.Element[0].Name = "MyElement"
    schema3.Element[0].SubstitutionGroup = new QName( "schema", "BaseElement" )
    schema3.Element[1].Name = "BaseElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var type = $$TESTPACKAGE$$.schema.MyElement",
        "assertEquals( $$TESTPACKAGE$$.schema.MyElement,                               type )",
        "assertEquals( $$TESTPACKAGE$$.schema2.MyElement,                              type.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema3.MyElement,                              type.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema.BaseElement,                             type.Supertype.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema2.BaseElement,                            type.Supertype.Supertype.Supertype.Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema3.BaseElement,                            type.Supertype.Supertype.Supertype.Supertype.Supertype )"
    } )

  }

  @Test
  function testImportOfSchemaWithNoTargetNamespace() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    assertNull(schema.Import[0].Namespace)
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Ref = new QName( "Child" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    assertNull(schema2.TargetNamespace)
    schema2.Element[0].Name = "Child"
    schema2.Element[0].Type = schema2.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "xml.print()"
    } )
  }

  @Test
  function testStaticUsageOfComponentDefinedViaIndirectImport() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[1].Namespace = new URI( "schema3" )
    assertNull( schema.Import[1].SchemaLocation ) // lack of schemaLocation is intentional
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "schema3", "rootType" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.SimpleType[0].Name = "rootType"
    schema3.SimpleType[0].Restriction.Base = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "assertEquals( $$TESTPACKAGE$$.schema3.types.simple.RootType, statictypeof new $$TESTPACKAGE$$.schema.Root().$TypeInstance )",
        "assertEquals( java.lang.Integer, statictypeof new $$TESTPACKAGE$$.schema.Root().$Value )"
    } )
  }

  @Test
  function testRuntimeUsageOfComponentDefinedViaIndirectImport() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "schema" )
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "root"
    // lack of any direct reference from schema to schema3 is intentional - so asserting that fact...
    assertFalse(schema.Import.where(\i -> i.Namespace == new URI("schema2")).isEmpty())
    assertTrue( schema.Import.where( \ i ->i.Namespace == new URI( "schema3" ) ).isEmpty() )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.ComplexType[0].Name = "schema3Type"
    schema3.ComplexType[0].Sequence.Element[0].Name = "child"
    schema3.ComplexType[0].Sequence.Element[0].Type = schema3.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root xmlns='schema' xsi:type='schema3:schema3Type' xmlns:schema3='schema3' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'><child xmlns=''>5</child></root>\" )",
        "assertEquals( gw.xsd.w3c.xmlschema.types.complex.AnyType, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema3.types.complex.Schema3Type, typeof xml.$TypeInstance )"
    } )
  }

  @Test
  function testImportOfCompatibilityModeSchemaResultsInException() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Import[0].Namespace = new URI( schema.$Namespace.NamespaceURI )
    schema.Import[0].SchemaLocation = new URI( "../xsd/XMLSchema.xsd" )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {} )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      assertEquals( XmlException, typeof ex )
//      assertTrue(ex.Message.contains("cannot import a compatibility-mode schema (xsd.xmlschema)"))
    }

  }

  // an import without a schema location previously threw an NPE
  @Test
  function testImportWithoutSchemaLocation() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Import[0].Namespace = new URI( "urn:schema3" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "urn:schema3", "rootType" )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()"
      })
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertEquals( XmlException, typeof ex.Cause )
      assertTrue(ex.Cause.Message.contains("Schema not found with namespace 'urn:schema3'"))
    }
  }

  @Test
  function testImportWithIncorrectNamespace() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[0].Namespace = new URI( "urn:wrongnamespace" )
    schema.Element[0].Name = "root"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:schema2" )

    try {
      XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
          "var xml = new schema.Root()"
      } )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertEquals( XmlException, typeof ex.Cause )
      assertEquals(ex.Cause.Message, "The namespace attribute, 'urn:wrongnamespace', of an <import> element information item must be identical to the targetNamespace attribute, 'urn:schema2', of the imported document")
    }
  }

  @Test
  function testIncludeOfImportWithIncorrectNamespace() {
    var s1 = new gw.xsd.w3c.xmlschema.Schema()
    s1.TargetNamespace = new URI( "urn:s1" )
    s1.Include[0].SchemaLocation = new URI( "s2.xsdi" )

    var s2 = new gw.xsd.w3c.xmlschema.Schema()
    s2.Import[0].SchemaLocation = new URI( "s3.xsd" )
    s2.Import[0].Namespace = new URI( "urn:wrongnamespace" )
    s2.Element[0].Name = "root"

    var s3 = new gw.xsd.w3c.xmlschema.Schema()
    s3.TargetNamespace = new URI( "urn:s3" )

    try {
      XmlSchemaTestUtil.runWithResources( { s1, s2, s3 }, { "s1.xsd", "s2.xsdi", "s3.xsd" }, {
          "var xml = new s1.Root()"
      })
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertEquals( XmlException, typeof ex.Cause )
      assertEquals(ex.Cause.Message, "The namespace attribute, 'urn:wrongnamespace', of an <import> element information item must be identical to the targetNamespace attribute, 'urn:s3', of the imported document")
    }
  }

  @Test
  @Ignore("Not sure why this is failing")
  function testIncludeOfImportWithIncorrectNamespace_FromWsdl() {
    // this is a duplicate of WsdlValidatorTest.testInvalidSchema_IncludeOfImportWithIncorrectNamespace()
    var s1 = new gw.xsd.w3c.xmlschema.Schema()
    s1.Include[0].SchemaLocation = new URI( "s2.xsdi" )
    s1.TargetNamespace = new URI( "urn:s1" )

    var w1 = new gw.xsd.w3c.wsdl.Definitions()
    w1.TargetNamespace = new URI( "urn:w1" )
    w1.Types[0].$Children[0] = s1

    var s2 = new gw.xsd.w3c.xmlschema.Schema()
    s2.Import[0].SchemaLocation = new URI( "s3.xsd" )
    s2.Import[0].Namespace = new URI( "urn:wrongnamespace" )
    s2.Element[0].Name = "root"

    var s3 = new gw.xsd.w3c.xmlschema.Schema()
    s3.TargetNamespace = new URI( "urn:s3" )

    try {
      XmlSchemaTestUtil.runWithResources( { w1, s2, s3 }, { "w1.wsdl", "s2.xsdi", "s3.xsd" }, {
          "var xml = new w1.elements.Root()"
      })
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertEquals( XmlException, typeof ex.Cause )
      assertEquals(ex.Cause.Message, "The namespace attribute, 'urn:wrongnamespace', of an <import> element information item must be identical to the targetNamespace attribute, 'urn:s3', of the imported document")
    }
  }

  // PL-24055 - Unable to determine IType for element
  @Test
  function testJira_PL24055() {
    var schema1 = new Schema() {
        :TargetNamespace = new URI( "urn:schema1" ),
        :Import = {
        new() {
            :Namespace = new URI( "urn:schema2" ),
            :SchemaLocation = new URI( "schema2.xsd" )
            },
        new() {
            :Namespace = new URI( "urn:schema4" ),
            :SchemaLocation = new URI( "schema4.xsd" )
            }
    },
        :Element = {
        new() {
            :Name = "root",
            :Type = new QName( "urn:schema1", "rootAbstractType" )
            }
    },
        :ComplexType = {
        new() {
            :Name = "rootAbstractType",
            :Abstract = true
            }
    }
        }

    var schema2 = new Schema() {
        :TargetNamespace = new URI( "urn:schema2" ),
        :Import = {
        new() {
            :Namespace = new URI( "urn:schema3" ),
            :SchemaLocation = new URI( "schema3.xsd" )
            }
    }
        }

    var schema3 = new Schema() {
        :TargetNamespace = new URI( "urn:schema3" ),
        :Import = {
        new() {
            :Namespace = new URI( "urn:schema1" ),
            :SchemaLocation = new URI( "schema.xsd" )
            }
    },
        :ComplexType = {
        new() {
            :Name = "Schema3Subtype",
            :ComplexContent = new() {
            :Extension = new() {
            :Base = new QName( "urn:schema1", "rootAbstractType" ),
            :Sequence = new() {
            :Element = {
            new() {
                :Name = "child1",
                :Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
                }
        }
            }
            }
            }
            }
    }
        }

    var schema4 = new Schema() { // this schema serves no purpose other than to exploit the bug by appearing as the last import in schema1
        :TargetNamespace = new URI( "urn:schema4" )
        }

    XmlSchemaTestUtil.runWithResources( { schema1, schema2, schema3, schema4 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$TypeInstance = new $$TESTPACKAGE$$.schema3.types.complex.Schema3Subtype() { :Child1 = 5 }",
        "var bytes = xml.bytes()",
        "xml = xml.parse( bytes )" // this would previously fail with "Unable to determine IType for element child1" due to failure in looking up gosu namespace for xml namespace during processing
    } )
  }

}