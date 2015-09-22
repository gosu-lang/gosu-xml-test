package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses org.junit.Test

uses javax.xml.namespace.QName

class XmlSchemaAnyAttributeTest extends XSDTest {

  @Test
  function testAnyAttributeSimple() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.AnyAttribute = new gw.xsd.w3c.xmlschema.AnyAttribute()
    schema.Attribute[0].Name = "attr"
    schema.Attribute[0].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( 'attr', '5' )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( java.lang.Integer, xml.getAttributeSimpleValue( 'attr' ).GosuValueType )"
    } )
  }

  @Test
  function testAnyAttributeWithAttributeGroup() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.AttributeGroup[0].Ref = new QName( "attrgroup" )
    schema.AttributeGroup[0].Name = "attrgroup"
    schema.AttributeGroup[0].AnyAttribute = new gw.xsd.w3c.xmlschema.AnyAttribute()
    schema.Attribute[0].Name = "attr"
    schema.Attribute[0].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( 'attr', '5' )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( java.lang.Integer, xml.getAttributeSimpleValue( 'attr' ).GosuValueType )"
    } )
  }

  @Test
  function testAnyAttributeWithComplexContentExtension() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.ComplexContent.Extension.Base = new QName( "ctype" )
    schema.ComplexType[0].Name = "ctype"
    schema.ComplexType[0].AnyAttribute = new gw.xsd.w3c.xmlschema.AnyAttribute()
    schema.Attribute[0].Name = "attr"
    schema.Attribute[0].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( 'attr', '5' )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( java.lang.Integer, xml.getAttributeSimpleValue( 'attr' ).GosuValueType )"
    } )
  }

  @Test
  function testAnyAttributeWithComplexContentExtensionWithAttributeGroup() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.ComplexContent.Extension.Base = new QName( "ctype" )
    schema.ComplexType[0].Name = "ctype"
    schema.ComplexType[0].AttributeGroup[0].Ref = new QName( "attrgroup" )
    schema.AttributeGroup[0].Name = "attrgroup"
    schema.AttributeGroup[0].AnyAttribute = new gw.xsd.w3c.xmlschema.AnyAttribute()
    schema.Attribute[0].Name = "attr"
    schema.Attribute[0].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( 'attr', '5' )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( java.lang.Integer, xml.getAttributeSimpleValue( 'attr' ).GosuValueType )"
    } )
  }
}