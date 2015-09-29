package gw.xml.xsd.typeprovider

uses gw.lang.reflect.IType
uses gw.xml.XmlSimpleValueException
uses org.junit.Assert

class XSDTest extends Assert {

  function assertXmlSimpleValueException( bl : block() ) {
    try {
      bl()
      fail( "Expected XmlSimpleValueException" )
    }
    catch ( ex : XmlSimpleValueException) {
      // good
    }
  }

  function assertExceptionThrown(blk : block():void, ex : IType) {
    try {
      blk()
    } catch (e : Throwable) {
      var expected = ex.DisplayName
      var found = (typeof e).DisplayName
      assertTrue("Expected exception of type ${expected} found ${found}}", ex.isAssignableFrom(typeof e))
    }
  }

}