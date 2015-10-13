package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.wsdl.Definitions
uses gw.xsd.w3c.xmlschema.Schema
uses org.junit.Ignore
uses org.junit.Test

uses javax.xml.namespace.QName
uses java.net.URI

class XmlSchemaValidateAgainstWsdlTest {

  @Test
  @Ignore("WSDL is broken")
  function testWsdlThatImportsWsdlButContainsNoSchemasCanResolveComponentsInImportedWsdl() {

    var def = new Definitions()
    def.TargetNamespace = new URI( "urn:wsdl" )
    def.Import[0].Namespace = new URI( "urn:wsdl2" )
    def.Import[0].Location = new URI( "wsdl2.wsdl" )

    var schema = new Schema()
    schema.Element[0].Name = "child"

    var def2 = new Definitions()
    def2.TargetNamespace = new URI( "urn:wsdl2" )
    def2.Types[0].$Children[0] = schema

    var anySchema = new Schema()
    anySchema.TargetNamespace = new URI( "urn:schema" )
    anySchema.Element[0].Name = "root"
    anySchema.Element[0].ComplexType.Sequence.Any[0].ProcessContents = Strict

    XmlSchemaTestUtil.runWithResources( { def, def2, anySchema }, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<schema:root xmlns:schema='urn:schema'><child/></schema:root>\", new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.wsdl.util.SchemaAccess } } )",
        "assertEquals( $$TESTPACKAGE$$.wsdl2.elements.Child, typeof xml.$Children[0] )"
    } )
  }

  @Test
  @Ignore("WSDL is broken")
  function testWsdlThatImportsWsdlThatImportsSchemaCanResolveComponentsInImportedSchema() {

    var def = new Definitions()
    def.TargetNamespace = new URI( "urn:wsdl" )
    def.Import[0].Namespace = new URI( "urn:wsdl2" )
    def.Import[0].Location = new URI( "wsdl2.wsdl" )

    var embeddedSchema = new Schema()
    embeddedSchema.Import[0].Namespace = new URI( "urn:schema" )
    embeddedSchema.Import[0].SchemaLocation = new URI( "schema.xsd" )

    var def2 = new Definitions()
    def2.TargetNamespace = new URI( "urn:wsdl2" )
    def2.Types[0].$Children[0] = embeddedSchema

    var importedSchema = new Schema()
    importedSchema.TargetNamespace = new URI( "urn:schema" )
    importedSchema.Element[0].Name = "root"
    importedSchema.Element[0].Type = importedSchema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResources( { def, def2, importedSchema }, {
        "var xml = gw.xml.XmlElement.parse( \"<schema:root xmlns:schema='urn:schema'>5</schema:root>\", new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.wsdl.util.SchemaAccess } } )",
        "assertEquals( $$TESTPACKAGE$$.schema.Root, typeof xml )"
    } )
  }

  @Test
  @Ignore("WSDL is broken")
  function testXmlIsValidatedAgainstWsdl() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Name = "child"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Attribute[0].Use = Required

    var wsdl = new Definitions()
    wsdl.Types[0].$Children[0] = schema

    XmlSchemaTestUtil.runWithResource( wsdl, {
        "var xml = new $$TESTPACKAGE$$.wsdl.elements.Root()",
        "try {",
        "  xml.print()",
        "  fail( 'Expected XmlException' )",
        "}",
        "catch ( ex : gw.xml.XmlException ) {",
        "  assertThat().string( ex.Cause.Cause.Message ).contains( 'cvc-complex-type.4' )",
        "}"
    } )
  }

  @Test
  @Ignore("WSDL is broken")
  function testXmlIsValidatedAgainstWsdlWithMultipleSchemas() {
    var schema = new Schema()
    schema.Import[0].Namespace = new URI( "urn:schema2" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Ref = new QName( "urn:schema2", "testXmlIsValidatedAgainstWsdlWithMultipleSchemasChild" )
    schema.Element[0].ComplexType.Attribute[0].Use = Required

    var schema2 = new Schema()
    schema2.TargetNamespace = new URI( "urn:schema2" )
    schema2.Attribute[0].Name = "testXmlIsValidatedAgainstWsdlWithMultipleSchemasChild"
    schema2.Attribute[0].Type = schema.$Namespace.qualify( "int" )

    var wsdl = new Definitions()
    wsdl.Types[0].$Children[0] = schema
    wsdl.Types[0].$Children[1] = schema2

    XmlSchemaTestUtil.runWithResource( wsdl, {
        "var xml = new $$TESTPACKAGE$$.wsdl.elements.Root()",
        "try {",
        "  xml.print()",
        "  fail( 'Expected XmlException' )",
        "}",
        "catch ( ex : gw.xml.XmlException ) {",
        "  ex.printStackTrace()",
        "  assertThat().string( ex.Cause.Cause.Message ).contains( 'cvc-complex-type.4' )",
        "}"
    } )
  }

  @Test
  @Ignore("WSDL is broken")
  function testXmlIsValidatedAgainstWsdlWithImportedWsdl() {
    var schema = new Schema()
    schema.Import[0].Namespace = new URI( "urn:schema2" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Ref = new QName( "urn:schema2", "testXmlIsValidatedAgainstWsdlWithImportedWsdlChild" )
    schema.Element[0].ComplexType.Attribute[0].Use = Required

    var schema2 = new Schema()
    schema2.TargetNamespace = new URI( "urn:schema2" )
    schema2.Attribute[0].Name = "testXmlIsValidatedAgainstWsdlWithImportedWsdlChild"
    schema2.Attribute[0].Type = schema.$Namespace.qualify( "int" )

    var wsdl = new Definitions()
    wsdl.Import[0].Namespace = new URI( "urn:wsdl2" )
    wsdl.Import[0].Location = new URI( "wsdl2.wsdl" )
    wsdl.Types[0].$Children[0] = schema

    var wsdl2 = new Definitions()
    wsdl2.TargetNamespace = new URI( "urn:wsdl2" )
    wsdl2.Types[0].$Children[0] = schema2

    XmlSchemaTestUtil.runWithResources( { wsdl, wsdl2 }, {
        "var xml = new $$TESTPACKAGE$$.wsdl.elements.Root()",
        "try {",
        "  xml.print()",
        "  fail( 'Expected XmlException' )",
        "}",
        "catch ( ex : gw.xml.XmlException ) {",
        "  ex.printStackTrace()",
        "  assertThat().string( ex.Cause.Cause.Message ).contains( 'cvc-complex-type.4' )",
        "}"
    } )

  }

  @Test
  @Ignore("WSDL is broken")
  function testXmlIsValidatedAgainstWsdlWithCircularImport() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Import[0].Namespace = new URI( "urn:schema2" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Ref = new QName( "urn:schema2", "child" )
    schema.Element[0].ComplexType.Attribute[0].Use = Required
    schema.Attribute[0].Name = "child"
    schema.Attribute[0].Type = schema.$Namespace.qualify( "int" )

    var schema2 = new Schema()
    schema2.TargetNamespace = new URI( "urn:schema2" )
    schema2.Import[0].Namespace = new URI( "urn:schema" )
    schema2.Element[0].Name = "root"
    schema2.Element[0].ComplexType.Attribute[0].Ref = new QName( "urn:schema", "child" )
    schema2.Element[0].ComplexType.Attribute[0].Use = Required
    schema2.Attribute[0].Name = "child"
    schema2.Attribute[0].Type = schema.$Namespace.qualify( "int" )

    var wsdl = new Definitions()
    wsdl.TargetNamespace = new URI( "urn:wsdl" )
    wsdl.Import[0].Namespace = new URI( "urn:wsdl2" )
    wsdl.Import[0].Location = new URI( "wsdl2.wsdl" )
    wsdl.Types[0].$Children[0] = schema

    var wsdl2 = new Definitions()
    wsdl2.TargetNamespace = new URI( "urn:wsdl2" )
    wsdl2.Import[0].Namespace = new URI( "urn:wsdl" )
    wsdl2.Import[0].Location = new URI( "wsdl.wsdl" )
    wsdl2.Types[0].$Children[0] = schema2

    XmlSchemaTestUtil.runWithResources( { wsdl, wsdl2 }, {
        "var xml = new $$TESTPACKAGE$$.wsdl.elements.Root()",
        "try {",
        "  xml.print()",
        "  fail( 'Expected XmlException' )",
        "}",
        "catch ( ex : gw.xml.XmlException ) {",
        "  ex.printStackTrace()",
        "  assertThat().string( ex.Cause.Cause.Message ).contains( 'cvc-complex-type.4' )",
        "}",
        "var xml2 = new $$TESTPACKAGE$$.wsdl2.elements.Root()",
        "try {",
        "  xml2.print()",
        "  fail( 'Expected XmlException' )",
        "}",
        "catch ( ex : gw.xml.XmlException ) {",
        "  ex.printStackTrace()",
        "  assertThat().string( ex.Cause.Cause.Message ).contains( 'cvc-complex-type.4' )",
        "}"
    } )

  }
}