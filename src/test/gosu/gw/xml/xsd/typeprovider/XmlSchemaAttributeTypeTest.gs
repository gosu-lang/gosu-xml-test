package gw.xml.xsd.typeprovider

uses org.junit.Test

uses java.net.URI
uses javax.xml.namespace.QName

class XmlSchemaAttributeTypeTest extends XSDTest {

  @Test
  function testTopLevelAttribute() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Attribute[0].Name = "attr"
    schema.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    assertAttributeTypeWorks( schema, "attributes.Attr", true )
  }

  @Test
  function testAttributeGroup_AttributeFormDefaultUnqualified() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.ComplexType[0].Name = "ctype"
    schema.ComplexType[0].AttributeGroup[0].Ref = new QName( "urn:schema", "attrGroup" )
    schema.AttributeGroup[0].Name = "attrGroup"
    schema.AttributeGroup[0].Attribute[0].Name = "attr"
    schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    assertAttributeTypeWorks( schema, "anonymous.attributes.Ctype_Attr", false )
  }

  @Test
  function testAttributeGroup_AttributeFormDefaultQualified() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.ComplexType[0].Name = "ctype"
    schema.ComplexType[0].AttributeGroup[0].Ref = new QName( "urn:schema", "attrGroup" )
    schema.AttributeFormDefault = Qualified
    schema.AttributeGroup[0].Name = "attrGroup"
    schema.AttributeGroup[0].Attribute[0].Name = "attr"
    schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    assertAttributeTypeWorks( schema, "anonymous.attributes.Ctype_Attr", true )
  }

  @Test
  function testAttributeGroup_AttributeFormDefaultUnqualified_AttributeFormQualified() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.ComplexType[0].Name = "ctype"
    schema.ComplexType[0].AttributeGroup[0].Ref = new QName( "urn:schema", "attrGroup" )
    schema.AttributeGroup[0].Name = "attrGroup"
    schema.AttributeGroup[0].Attribute[0].Name = "attr"
    schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.AttributeGroup[0].Attribute[0].Form = Qualified
    assertAttributeTypeWorks( schema, "anonymous.attributes.Ctype_Attr", true )
  }

  @Test
  function testAttributeGroup_AttributeFormDefaultQualified_AttributeFormUnqualified() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.ComplexType[0].Name = "ctype"
    schema.ComplexType[0].AttributeGroup[0].Ref = new QName( "urn:schema", "attrGroup" )
    schema.AttributeFormDefault = Qualified
    schema.AttributeGroup[0].Name = "attrGroup"
    schema.AttributeGroup[0].Attribute[0].Name = "attr"
    schema.AttributeGroup[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.AttributeGroup[0].Attribute[0].Form = Unqualified
    assertAttributeTypeWorks( schema, "anonymous.attributes.Ctype_Attr", false )
  }

  @Test
  function testAnonymousAttribute() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Name = "attr"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    assertAttributeTypeWorks( schema, "anonymous.attributes.Root_Attr", false )
  }

  @Test
  function testAttributeRefDoesNotCreateType() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Attribute[0].Name = "attr"
    schema.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].Name = "root"
    var attrName = "attr"
    schema.Element[0].ComplexType.Attribute[0].Ref = new QName( "urn:schema", attrName )
    schema.Element[0].ComplexType.Attribute[1].Name = attrName + "x"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "int" )
    assertAttributeTypeWorks( schema, "attributes.Attr", true )
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertNotNull( gw.lang.reflect.TypeSystem.getByFullNameIfValid( \"$$TESTPACKAGE$$.schema.attributes.Attr\" ) )",
        "var baseName = \"$$TESTPACKAGE$$.schema.anonymous.attributes.Root_Attr\"",
        "assertNull( gw.lang.reflect.TypeSystem.getByFullNameIfValid( baseName ) )",
        "assertNotNull( gw.lang.reflect.TypeSystem.getByFullNameIfValid( baseName + \"x\" ) )"
    } )
  }

  function assertAttributeTypeWorks( schema : gw.xsd.w3c.xmlschema.Schema, relativeTypeName : String, qualified : boolean ) {
    XmlSchemaTestUtil.runWithResource( schema, {
        "var qname = new javax.xml.namespace.QName( ${ qualified ? "\"urn:schema\", " : "" }\"attr\" )",
        "assertNotNull( $$TESTPACKAGE$$.schema.${relativeTypeName} )",
        "assertEquals( qname, $$TESTPACKAGE$$.schema.${relativeTypeName}.$QNAME )",
        "var method = $$TESTPACKAGE$$.schema.${relativeTypeName}.Type.TypeInfo.getMethod( \"set\", { gw.xml.XmlElement, java.lang.Integer } )",
        "assertNotNull( method )",
        "assertEquals( 2, method.Parameters.Count )",
        "assertEquals( gw.xml.XmlElement, method.Parameters[0].FeatureType )",
        "assertEquals( java.lang.Integer, method.Parameters[1].FeatureType )",
        "var xml = new gw.xml.XmlElement( \"root\" )",
        "$$TESTPACKAGE$$.schema.${relativeTypeName}.set( xml, 42 )",
        "assertEquals( java.lang.Integer, typeof xml.getAttributeSimpleValue( qname ).GosuValue )",
        "assertEquals( 42, xml.getAttributeSimpleValue( qname ).GosuValue )",
        ""
    } )
  }

}