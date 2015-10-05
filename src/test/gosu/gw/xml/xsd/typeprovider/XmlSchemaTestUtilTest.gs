package gw.xml.xsd.typeprovider

uses org.junit.Test

uses java.lang.AssertionError

class XmlSchemaTestUtilTest extends XSDTest {

  @Test
  function testRunWithSchema() {
    try {
      XmlSchemaTestUtil.runWithResource( new gw.xsd.w3c.xmlschema.Schema(), { "fail()" } )
      fail( "Expected AssertionError" )
    }
    catch ( ex : AssertionError ) {
      // good
    }
    try {
      // should fail due to "unused variable" warning
      XmlSchemaTestUtil.runWithResource( new gw.xsd.w3c.xmlschema.Schema(), { "var x = 5" } )
      fail( "Expected AssertionError" )
    }
    catch ( ex : AssertionError ) {
      // good
    }
    XmlSchemaTestUtil.runWithResource( new gw.xsd.w3c.xmlschema.Schema(), { "print( \"Hello, World!\" )" } ) // should pass
  }

//  function testEnumTypeIsStillValidAfterTypeSystemRefresh() {
//    var schema = new gw.xsd.w3c.xmlschema.Schema()
//    XmlSchemaTestUtil.runWithResource( schema, {} )
//    var xml = new IntListWithAllFacets()
//    xml.$Value = ws.schema.test.list.enums.IntListWithAllFacets._111_222_333_444_555
//    xml = xml.parse( xml.bytes() )
//    assertThat( xml.$Value ).as( "Enumeration value" ).isEqualTo( ws.schema.test.list.enums.IntListWithAllFacets._111_222_333_444_555 )
//  }
}