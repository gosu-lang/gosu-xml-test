package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses gw.xsd.w3c.xmlschema.Enumeration
uses gw.xml.XmlSimpleValue
uses org.junit.Test

uses javax.xml.namespace.QName

class XmlSchemaEnumerationValueOfTest {

  @Test
  function testValueOfString() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].SimpleType.Restriction.Base = gw.xsd.w3c.xmlschema.types.simple.String.$QNAME
    schema.Element[0].SimpleType.Restriction.Enumeration[0].Value = "value1"
    schema.Element[0].SimpleType.Restriction.Enumeration[1].Value = "value2"
    schema.Element[0].SimpleType.Restriction.Enumeration[2].Value = "value3"
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( String, $$TESTPACKAGE$$.schema.enums.Root.Type.TypeInfo.Methods.singleWhere( \\ m ->m.DisplayName == 'forGosuValue' ).Parameters[0].FeatureType )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Value1, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( 'value1' ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( 'Value1' ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( null ) )"
    } )
  }

  @Test
  function testValueOfInt() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].SimpleType.Restriction.Base = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    schema.Element[0].SimpleType.Restriction.Enumeration[0].Value = "1"
    schema.Element[0].SimpleType.Restriction.Enumeration[1].Value = "2"
    schema.Element[0].SimpleType.Restriction.Enumeration[2].Value = "42"
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( java.lang.Integer, $$TESTPACKAGE$$.schema.enums.Root.Type.TypeInfo.Methods.singleWhere( \\ m ->m.DisplayName == 'forGosuValue' ).Parameters[0].FeatureType )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root._42, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( 42 ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( 43 ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( null ) )"
    } )
  }

  @Test
  function testValueOfQName() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].SimpleType.Restriction.Base = gw.xsd.w3c.xmlschema.types.simple.QName.$QNAME
    schema.Element[0].SimpleType.Restriction.Enumeration[0] = new Enumeration()
    schema.Element[0].SimpleType.Restriction.Enumeration[0].setAttributeSimpleValue( Enumeration.$ATTRIBUTE_QNAME_Value, XmlSimpleValue.makeQNameInstance( new QName( "nsuri", "localpart" ) ) )
    schema.Element[0].SimpleType.Restriction.Enumeration[1] = new Enumeration()
    schema.Element[0].SimpleType.Restriction.Enumeration[1].setAttributeSimpleValue( Enumeration.$ATTRIBUTE_QNAME_Value, XmlSimpleValue.makeQNameInstance( new QName( "nsuri2", "localpart2" ) ) )
    schema.Element[0].SimpleType.Restriction.Enumeration[2] = new Enumeration()
    schema.Element[0].SimpleType.Restriction.Enumeration[2].setAttributeSimpleValue( Enumeration.$ATTRIBUTE_QNAME_Value, XmlSimpleValue.makeQNameInstance( new QName( "nsuri3", "localpart3" ) ) )
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( javax.xml.namespace.QName, $$TESTPACKAGE$$.schema.enums.Root.Type.TypeInfo.Methods.singleWhere( \\ m ->m.DisplayName == 'forGosuValue' ).Parameters[0].FeatureType )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Localpart, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( new javax.xml.namespace.QName( 'nsuri', 'localpart', 'Prefix' ) ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( new javax.xml.namespace.QName( 'nsuri', 'Localpart', 'prefix' ) ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( new javax.xml.namespace.QName( 'Nsuri', 'localpart', 'prefix' ) ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( null ) )"
    } )
  }

  @Test
  function testValueOfListOfString() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].SimpleType.Restriction.SimpleType.List.ItemType = gw.xsd.w3c.xmlschema.types.simple.String.$QNAME
    schema.Element[0].SimpleType.Restriction.Enumeration[0].Value = "value1 value2"
    schema.Element[0].SimpleType.Restriction.Enumeration[1].Value = "value2 value3"
    schema.Element[0].SimpleType.Restriction.Enumeration[2].Value = "value3 value1"
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( List<String>, $$TESTPACKAGE$$.schema.enums.Root.Type.TypeInfo.Methods.singleWhere( \\ m ->m.DisplayName == 'forGosuValue' ).Parameters[0].FeatureType )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Value1_value2, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 'value1', 'value2' } ) )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Value2_value3, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 'value2', 'value3' } ) )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root.Value3_value1, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 'value3', 'value1' } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 'Value1', 'value2' } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 'value1', 'Value2' } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 'value2', 'value1' } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 'value1' } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { null } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( {} ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( null ) )"
    } )
  }

  @Test
  function testValueOfListOfInt() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].SimpleType.Restriction.SimpleType.List.ItemType = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    schema.Element[0].SimpleType.Restriction.Enumeration[0].Value = "1 2"
    schema.Element[0].SimpleType.Restriction.Enumeration[1].Value = "2 3"
    schema.Element[0].SimpleType.Restriction.Enumeration[2].Value = "3 1"
    XmlSchemaTestUtil.runWithResource( schema, {
        "assertEquals( List<java.lang.Integer>, $$TESTPACKAGE$$.schema.enums.Root.Type.TypeInfo.Methods.singleWhere( \\ m ->m.DisplayName == 'forGosuValue' ).Parameters[0].FeatureType )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root._1_2, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 1, 2 } ) )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root._2_3, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 2, 3 } ) )",
        "assertEquals( $$TESTPACKAGE$$.schema.enums.Root._3_1, $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 3, 1 } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 2, 1 } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { 2 } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( { null } ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( {} ) )",
        "assertNull( $$TESTPACKAGE$$.schema.enums.Root.forGosuValue( null ) )"
    } )
  }

}