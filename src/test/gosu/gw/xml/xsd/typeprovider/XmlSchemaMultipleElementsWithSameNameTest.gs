package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses org.junit.Test

uses java.net.URI
uses javax.xml.namespace.QName

class XmlSchemaMultipleElementsWithSameNameTest {

  @Test
  function testSameNameSameTypeDifferentNamespace() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )"
    } )
  }

  @Test
  function testSameNameSameType() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem )"
    } )
  }

  @Test
  function testSameNameDerivedTypeDifferentNamespace() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "decimal" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )",
        "assertEquals( gw.xml.XmlElement, ( statictypeof xml.Child_elem ).Supertype )",
        "assertEquals( gw.xml.XmlElement, ( typeof xml.Child_elem ).Supertype )"
    } )
  }

  @Test
  function testSameNameDerivedType() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "decimal" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, ( statictypeof xml.Child_elem ).Supertype )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, ( typeof xml.Child_elem ).Supertype )"
    } )
  }

  @Test
  function testSameNameIncompatibleType() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "decimal" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem )",
        "assertEquals( gw.xml.XmlElement, ( statictypeof xml.Child_elem ).Supertype )",
        "assertEquals( gw.xml.XmlElement, ( typeof xml.Child_elem ).Supertype )"
    } )
  }

  @Test
  function testMultipleElementsInSequence() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = { 5, 5 }",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem[1] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, statictypeof xml.Child_elem[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.Child_elem[1] )"
    } )
  }

  @Test
  function testMultipleElementsInSequenceThatMatchUnreferencedTopLevelElement() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = { 5, 5 }",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[1] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[1] )"
    } )
  }

  @Test
  function testMultipleElementsInSequenceWithRef() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.ElementFormDefault = Qualified
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].Ref = new QName( "urn:foo", "child" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = { 5, 5 }",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[1] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, statictypeof xml.Child_elem[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Child, typeof xml.Child_elem[1] )"
    } )
  }

}