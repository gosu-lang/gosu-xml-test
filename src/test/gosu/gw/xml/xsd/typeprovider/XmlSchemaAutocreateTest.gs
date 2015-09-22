package gw.xml.xsd.typeprovider

uses org.junit.Test
uses xsd.pl_iso_2.ClaimsOccurrence

class XmlSchemaAutocreateTest {

  // PL-28296 - this used to fail with an OOME
  @Test
  function testPL28296_PostV7AutocreateViaInstanceProperty() {
    var prop = gw.xsd.w3c.xmlschema.Union#MemberTypes.PropertyInfo
    var autocreateAnnotation = prop.Annotations.firstWhere( \ ann ->ann.Type == Autocreate )
    for ( i in 1..100000 ) {
      if ( i % 1000 == 0 ) {
        print( i )
      }
      var x = autocreateAnnotation.Instance
    }
  }

  // PL-28296 - this used to fail with an OOME
  @Test
  function testPL28296_PostV7AutocreateViaApi() {
    var qname = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    for ( i in 1..100000 ) {
      if ( i % 1000 == 0 ) {
        print( i )
      }
      new gw.xsd.w3c.xmlschema.Union().MemberTypes[0] = qname
    }
  }

  // PL-28296 - this used to fail with an OOME
  @Test
  function testPL28296_PreV7AutocreateViaInstanceProperty() {
    var prop = xsd.pl_iso_2.ClaimsOccurrence#ComIso_RRECd.PropertyInfo
    var autocreateAnnotation = prop.Annotations.firstWhere( \ ann ->ann.Type == Autocreate )
    for ( i in 1..100000 ) {
      if ( i % 1000 == 0 ) {
        print( i )
      }
      var x = autocreateAnnotation.Instance
    }
  }

  // PL-28296 - this used to fail with an OOME
  @Test
  function testPL28296_PreV7AutocreateViaApi() {
    for ( i in 1..100000 ) {
      if ( i % 1000 == 0 ) {
        print( i )
      }
      //TODO - API CHANGE
//      new ClaimsOccurrence().ComIso_RRECd.Text = "foo"
    }
  }

}