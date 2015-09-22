package gw.xml.xsd.typeprovider

uses gw.xml.XmlElement
uses javax.xml.namespace.QName
uses java.net.URI
uses gw.xml.XmlException
uses org.junit.Test

class XmlSchemaAttributeOrderingTest extends XSDTest {

  @Test
  function testAttributeOrderIsMaintained() {
    var xml = new XmlElement( "root" )
    xml.setAttributeValue( "att1", "value" )
    xml.setAttributeValue( "att2", "value" )
    assertTrue(xml.asUTFString().contains("att1=\"value\" att2=\"value\""))
    xml = new XmlElement( "root" )
    xml.setAttributeValue( "att2", "value" )
    xml.setAttributeValue( "att1", "value" )
    assertTrue(xml.asUTFString().contains("att2=\"value\" att1=\"value\""))
  }

  @Test
  function testAttributesAreSortedToOrderDefinedInSchema() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "att1"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Attribute[1].Name = "att2"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "string" )
    schema.print()
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Att1 = \"value\"",
        "xml.Att2 = \"value\"",
        "assertTrue(  xml.asUTFString().contains( \"att1=\\\"value\\\" att2=\\\"value\\\"\" ) )",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Att2 = \"value\"",
        "xml.Att1 = \"value\"",
        "assertTrue(  xml.asUTFString().contains( \"att1=\\\"value\\\" att2=\\\"value\\\"\" ))",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"att1\", \"value\" )",
        "xml.setAttributeValue( \"att2\", \"value\" )",
        "assertTrue(  xml.asUTFString().contains( \"att1=\\\"value\\\" att2=\\\"value\\\"\" ))",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"att2\", \"value\" )",
        "xml.setAttributeValue( \"att1\", \"value\" )",
        "assertTrue(  xml.asUTFString().contains( \"att1=\\\"value\\\" att2=\\\"value\\\"\" ))"
    } )
  }

  @Test
  function testAttributeGroupAttributesAreInlinedIntoAttributeOrderWhenTheyAreReferenced() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "att1"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.AttributeGroup[0].Ref = new QName( "attgroup" )
    schema.Element[0].ComplexType.Attribute[1].Name = "att2"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "string" )
    schema.AttributeGroup[0].Name = "attgroup"
    schema.AttributeGroup[0].Attribute[0].Name = "attfromgroup1"
    schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.AttributeGroup[0].Attribute[1].Name = "attfromgroup2"
    schema.AttributeGroup[0].Attribute[1].Type = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attfromgroup2 = \"value\"",
        "xml.Att2 = \"value\"",
        "xml.Attfromgroup1 = \"value\"",
        "xml.Att1 = \"value\"",
        "xml.print()",
        "assertTrue(  xml.asUTFString().contains( \"att1=\\\"value\\\" attfromgroup1=\\\"value\\\" attfromgroup2=\\\"value\\\" att2=\\\"value\\\"\" ))",
        ""
    } )
  }

  @Test
  function testAttributesNotDefinedInSchemaAppearLast() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.AnyAttribute.ProcessContents = Skip
    schema.Element[0].ComplexType.Attribute[0].Name = "C"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Attribute[1].Name = "A"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"A\", \"value\" )",
        "xml.setAttributeValue( \"B\", \"value\" )",
        "xml.setAttributeValue( \"C\", \"value\" )",
        "assertTrue(  xml.asUTFString().contains( \"C=\\\"value\\\" A=\\\"value\\\" B=\\\"value\\\"\" ))",
        ""
    } )
  }


  @Test
  function testAttributesNotDefinedInSchemaAppearLastInOrderAsTheyAdded () {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"

    schema.Element[0].ComplexType.Attribute[0].Name = "C"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.AnyAttribute.ProcessContents = Skip
    schema.Element[0].ComplexType.Attribute[1].Name = "A"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "string" )
    schema.print()

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"B3\", \"value\" )",
        "xml.setAttributeValue( \"A\", \"value\" )",
        "xml.setAttributeValue( \"B1\", \"value\" )",
        "xml.setAttributeValue( \"B2\", \"value\" )",
        "xml.setAttributeValue( \"C\", \"value\" )",
        "xml.print()",
        "assertTrue(  xml.asUTFString().contains( \"C=\\\"value\\\" A=\\\"value\\\" B3=\\\"value\\\" B1=\\\"value\\\" B2=\\\"value\\\"\" ))",
        ""
    } )
  }

  @Test
  function testNoSortingIfAllAttributesWithProcessContentsSkip() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.AnyAttribute.ProcessContents = Skip
    schema.print()

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"B3\", \"value\" )",
        "xml.setAttributeValue( \"A\", \"value\" )",
        "xml.setAttributeValue( \"B1\", \"value\" )",
        "xml.setAttributeValue( \"B2\", \"value\" )",
        "xml.setAttributeValue( \"C\", \"value\" )",
        "xml.print()",
        "assertTrue(  xml.asUTFString().contains( \"B3=\\\"value\\\" A=\\\"value\\\" B1=\\\"value\\\" B2=\\\"value\\\" C=\\\"value\\\"\" ))",
        ""
    } )
  }

  @Test
  function testNoSortingIfAllAttributesWithProcessContentsLax() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.AnyAttribute.ProcessContents = Lax
    schema.print()

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"B3\", \"value\" )",
        "xml.setAttributeValue( \"A\", \"value\" )",
        "xml.setAttributeValue( \"B1\", \"value\" )",
        "xml.setAttributeValue( \"B2\", \"value\" )",
        "xml.setAttributeValue( \"C\", \"value\" )",
        "xml.print()",
        "assertTrue(  xml.asUTFString().contains( \"B3=\\\"value\\\" A=\\\"value\\\" B1=\\\"value\\\" B2=\\\"value\\\" C=\\\"value\\\"\" ))",
        ""
    } )
  }

  @Test
  function testProcessContentsStrictDoesNotAllowUndefinedAttributes () {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.AnyAttribute.ProcessContents = gw.xsd.w3c.xmlschema.enums.Wildcard_ProcessContents.Strict
    schema.print()
    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()",
          "xml.setAttributeValue( \"B3\", \"value\" )",
          "xml.setAttributeValue( \"A\", \"value\" )",
          "xml.print()",
          ""
      } )
      fail("Expected XML exception ")
    }
    catch (e : XmlException) {
      //good
    }
  }

  @Test
  function testImportedAttributesGetSorted() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Import[0].Namespace = new URI( "schema2" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "schemaAtt1"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.AttributeGroup[0].Ref = new QName( "schema2", "ChildAttGroup" )
    schema.Element[0].ComplexType.Attribute[1].Name = "schemaAtt2"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "string" )

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "schema2" )
    schema2.Import[0].Namespace = new URI( "schema3" )
    schema2.Import[0].SchemaLocation = new URI( "schema3.xsd" )
    schema2.AttributeGroup[0].Name = "ChildAttGroup"
    schema2.AttributeGroup[0].Attribute[0].Ref = new QName( "schema3", "schema3Att1" )
    schema2.AttributeGroup[0].Attribute[1].Ref = new QName( "schema3", "schema3Att2" )

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.TargetNamespace = new URI( "schema3" )
    schema3.Attribute[0].Name = "schema3Att2" //named as Att2 on purpose
    schema3.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema3.Attribute[1].Name = "schema3Att1"
    schema3.Attribute[1].Type = schema.$Namespace.qualify( "byte" )
    schema3.Element[0].Name = "RootSchema3"
    schema3.Element[0].ComplexType.Attribute[0].Ref = new QName( "schema3", "schema3Att1" )
    schema3.Element[0].ComplexType.Attribute[1].Ref = new QName( "schema3", "schema3Att2" )

    XmlSchemaTestUtil.runWithResources( { schema, schema2 , schema3 }, {
        "var xml3 = new $$TESTPACKAGE$$.schema3.RootSchema3()",
        "xml3.Schema3Att1=1",
        "xml3.Schema3Att2=2",
        "xml3.print()",
        "assertTrue(  xml3.asUTFString().contains( \"ns0:schema3Att1=\\\"1\\\" ns0:schema3Att2=\\\"2\\\"\"))",
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Schema3Att2=3",
        "xml.SchemaAtt2= \"value\"",
        "xml.SchemaAtt1= \"value\"",
        "xml.Schema3Att1=3",
        "assertTrue(  xml.asUTFString().contains( \"schemaAtt1=\\\"value\\\" ns0:schema3Att1=\\\"3\\\" ns0:schema3Att2=\\\"3\\\" schemaAtt2=\\\"value\\\" xmlns:ns0=\\\"schema3\\\"\" ))",
        ""
    } )
  }
}