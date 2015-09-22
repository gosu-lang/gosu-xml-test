package gw.xml.xsd.typeprovider

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

}