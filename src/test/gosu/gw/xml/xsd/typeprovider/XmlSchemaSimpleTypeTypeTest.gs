package gw.xml.xsd.typeprovider

uses java.lang.Integer
uses gw.xml.XmlSimpleValueException
uses org.junit.Ignore
uses org.junit.Test

class XmlSchemaSimpleTypeTypeTest extends XSDTest {

  @Test
  @Ignore("Not sure on this one...")
  function testTypesAreBackedProperly() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithMaxInclusive5()
    assertEquals( "gw.internal.schema.gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithMaxInclusive5", x.$Class.Name )
    var y = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithMaxInclusive5()
    assertEquals( "gw.internal.schema.gw.xsd.w3c.xmlschema.types.simple.Int", y.$Class.Name ) // inherits the class of the nearest java-backed supertype in the hierarchy, in this case, Int
  }

  @Test
  function testNonJavaBackedSimpleType() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithMaxInclusive5()
    assertNull( x.$Value )
    var value : Integer = 5
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithMaxInclusive5( value )
    assertEquals( java.lang.Integer, statictypeof x.$Value )
    assertEquals( java.lang.Integer, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithMaxInclusive5.Type.TypeInfo.getConstructor( { java.lang.Integer } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( java.lang.Integer, ctor.Parameters[0].FeatureType )
  }

  @Test
  function testNonJavaBackedSimpleTypeEnforcesFacets() {
    try {
      var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithMaxInclusive5( 6 )
      fail( "Expected XmlSimpleValueException but got ${x}" )
    }
    catch ( ex : XmlSimpleValueException) {
      // good
    }
  }

  @Test
  function testNonJavaBackedSimpleTypeWithEnum() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithEnum()
    assertNull( x.$Value )
    var value = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum.Value2
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithEnum( value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum, statictypeof x.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.simple.SimpleTypeWithEnum.Type.TypeInfo.getConstructor( { gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum, ctor.Parameters[0].FeatureType )
  }

  @Test
  function testNonJavaBackedComplexTypeWithSimpleContent() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.complex.ComplexTypeWithMaxInclusive5()
    assertNull( x.$Value )
    var value : Integer = 5
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.complex.ComplexTypeWithMaxInclusive5( value )
    assertEquals( java.lang.Integer, statictypeof x.$Value )
    assertEquals( java.lang.Integer, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.complex.ComplexTypeWithMaxInclusive5.Type.TypeInfo.getConstructor( { java.lang.Integer } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( java.lang.Integer, ctor.Parameters[0].FeatureType )
  }

  @Test
  function testNonJavaBackedComplexTypeWithSimpleContentEnforcesFacets() {
    try {
      var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.complex.ComplexTypeWithMaxInclusive5( 6 )
      fail( "Expected XmlSimpleValueException but got ${x}" )
    }
    catch ( ex : XmlSimpleValueException ) {
      // good
    }
  }

  @Test
  function testNonJavaBackedComplexTypeWithSimpleContentWithEnum() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.complex.ComplexTypeWithEnum()
    assertNull( x.$Value )
    var value = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum.Value2
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.complex.ComplexTypeWithEnum( value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum, statictypeof x.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.types.complex.ComplexTypeWithEnum.Type.TypeInfo.getConstructor( { gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetestschema.enums.SimpleTypeWithEnum, ctor.Parameters[0].FeatureType )
  }

/////////////////////////////

  @Test
  function testJavaBackedSimpleType() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithMaxInclusive5()
    assertNull( x.$Value )
    var value : Integer = 5
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithMaxInclusive5( value )
    assertEquals( java.lang.Integer, statictypeof x.$Value )
    assertEquals( java.lang.Integer, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithMaxInclusive5.Type.TypeInfo.getConstructor( { java.lang.Integer } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( java.lang.Integer, ctor.Parameters[0].FeatureType )
  }

  @Test
  function testJavaBackedSimpleTypeEnforcesFacets() {
    try {
      var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithMaxInclusive5( 6 )
      fail( "Expected XmlSimpleValueException but got ${x}" )
    }
    catch ( ex : XmlSimpleValueException ) {
      // good
    }
  }

  @Test
  function testJavaBackedSimpleTypeWithEnum() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithEnum()
    assertNull( x.$Value )
    var value = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum.Value2
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithEnum( value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum, statictypeof x.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.simple.SimpleTypeWithEnum.Type.TypeInfo.getConstructor( { gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum, ctor.Parameters[0].FeatureType )
  }

  @Test
  function testJavaBackedComplexTypeWithSimpleContent() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.complex.ComplexTypeWithMaxInclusive5()
    assertNull( x.$Value )
    var value : Integer = 5
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.complex.ComplexTypeWithMaxInclusive5( value )
    assertEquals( java.lang.Integer, statictypeof x.$Value )
    assertEquals( java.lang.Integer, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.complex.ComplexTypeWithMaxInclusive5.Type.TypeInfo.getConstructor( { java.lang.Integer } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( java.lang.Integer, ctor.Parameters[0].FeatureType )
  }

  @Test
  function testJavaBackedComplexTypeWithSimpleContentEnforcesFacets() {
    try {
      var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.complex.ComplexTypeWithMaxInclusive5( 6 )
      fail( "Expected XmlSimpleValueException but got ${x}" )
    }
    catch ( ex : XmlSimpleValueException ) {
      // good
    }
  }

  @Test
  function testJavaBackedComplexTypeWithSimpleContentWithEnum() {
    var x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.complex.ComplexTypeWithEnum()
    assertNull( x.$Value )
    var value = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum.Value2
    x = new gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.complex.ComplexTypeWithEnum( value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum, statictypeof x.$Value )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum, typeof x.$Value )
    assertEquals( value, x.$Value )
    var ctor = gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.types.complex.ComplexTypeWithEnum.Type.TypeInfo.getConstructor( { gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum } )
    assertNotNull( ctor )
    assertEquals( 1, ctor.Parameters.Count )
    assertEquals( gw.xml.xsd.typeprovider.xmlschemasimpletypetypetest_javabacked.enums.SimpleTypeWithEnum, ctor.Parameters[0].FeatureType )
  }

}