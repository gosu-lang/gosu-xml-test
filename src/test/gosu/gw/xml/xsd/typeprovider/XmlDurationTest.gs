package gw.xml.xsd.typeprovider

uses java.lang.RuntimeException
uses gw.xml.date.XmlDateTime
uses gw.xml.date.XmlYearMonth
uses gw.xml.date.XmlDate
uses gw.xml.date.XmlTime
uses gw.xml.date.XmlDay
uses gw.xml.date.XmlYear
uses gw.xml.date.XmlMonth
uses gw.xml.date.XmlDuration
uses gw.xml.date.XmlMonthDay
uses gw.xml.date.AbstractXmlDateType
uses org.junit.Test

class XmlDurationTest extends XSDTest {

  @Test
  function testExamplesBasedOnXMLSchemaDatatypesSpecificationWork()
  {
    // From http://www.w3.org/TR/xmlschema-2/#adding-durations-to-dateTimes :
    // Examples:
    // dateTime                duration             result
    // 2000-01-12T12:13:14Z    P1Y3M5DT7H10M3.3S    2001-04-17T19:23:17.3Z
    // 2000-01                 -P3M                 1999-10
    // 2000-01-12              PT33H                2000-01-13

    tryExample( new XmlDateTime( "2000-01-12T12:13:14Z" ), "P1Y3M5DT7H10M3.3S",   "2001-04-17T19:23:17.3Z" )
    tryExample( new XmlYearMonth( "2000-01" ),            "-P3M",                "1999-10" )
    tryExample( new XmlDate( "2000-01-12" ),               "PT33H",               "2000-01-13" )

    // additional tests

    tryExample( new XmlDateTime( "2000-01-12T12:13:14-07:00" ), "P1Y3M5DT7H10M3.3S", "2001-04-17T19:23:17.3-07:00" )
    tryExample( new XmlDateTime( "2000-01-12T12:13:14-07:00" ), "P6M", "2000-07-12T12:13:14-07:00" ) // ignore DST change

    tryExample( new XmlYearMonth( "2004-03" ), "-P1D", "2004-02" )
    tryExample( new XmlYearMonth( "2004-03" ), "-P0D", "2004-03" )
    tryExample( new XmlYearMonth( "2004-03" ), "-P30D", "2004-01" )

    tryExample( new XmlYearMonth( "2004-03" ), "-P29D", "2004-02" )
    tryExample( new XmlYearMonth( "2003-03" ), "-P29D", "2003-01" )
    tryExample( new XmlYearMonth( "2000-03" ), "-P29D", "2000-02" )
    tryExample( new XmlYearMonth( "1900-03" ), "-P29D", "1900-01" )

    tryExample( new XmlYearMonth( "1900-03" ), "-P60D", "1899-12" )

    tryExample( new XmlTime( "00:00:00" ), "-PT0.1S", "23:59:59.9" )

    tryExample( new XmlYear( "2008" ), "-PT0.000001S", "2007" )

    tryExample( new XmlYear( "2008" ), "-P3Y", "2005" )

    tryExample( new XmlMonth( "--07" ), "P6M", "--01" )

    tryExample( new XmlYear( "0001" ), "P1Y", "0002" )

    tryExample( new XmlDay( "---28" ), "P4D", "---01" )

    tryExample( new XmlDate( "2008-02-28" ), "PT23H", "2008-02-28" )
    tryExample( new XmlDate( "2008-02-28" ), "PT24H", "2008-02-29" )

    tryExample( new XmlDateTime( "2000-01-12T12:13:14-07:00" ), "P3M", "2000-04-12T12:13:14-07:00" )
    tryExample( new XmlDateTime( "2000-01-12T12:13:14-07:00" ), "PT3M", "2000-01-12T12:16:14-07:00" )
    tryExample( new XmlDateTime( "2000-01-12T12:13:14-07:00" ), "P3MT3M", "2000-04-12T12:16:14-07:00" )

    tryExample( new XmlTime( "00:00:00" ), "PT1H2M3.456789012345678901234567890012345678901234567890012345678901234567890S", "01:02:03.456789012345678901234567890012345678901234567890012345678901234567890" )

    tryExample( new XmlMonthDay( "--02-28" ), "P1D", "--02-29" ) // Not sure if this is to spec - we default to year zero which is a leap year
    tryExample( new XmlMonthDay( "--02-29" ), "P1Y", "--02-28" ) // Not sure if this is to spec - we default to year zero which is a leap year
    tryExample( new XmlMonthDay( "--02-29" ), "P4Y", "--02-29" ) // Not sure if this is to spec - we default to year zero which is a leap year

    tryDuration( "", true )
    tryDuration( "50M", true )
    tryDuration( "Z", true )
    tryDuration( "P", true ) // at least 1 component is required
    tryDuration( "P50", true )
    tryDuration( "P50M", false )
    tryDuration( "P50Z", true )
    tryDuration( "P50H", true )
    tryDuration( "PT", true ) // at least 1 component is required
    tryDuration( "PT50", true )
    tryDuration( "PT50M", false )
    tryDuration( "PT50Y", true )
    tryDuration( "P50T", true )
    tryDuration( "P50M50T50M", true )
    tryDuration( "P50MT50M", false )
    tryDuration( "P50MT50M50", true )

  }

  function tryDuration( s : String, exceptionExpected : boolean )
  {
    try
    {
      var duration = new XmlDuration( s )
      if ( exceptionExpected )
      {
        fail( "Expected exception for pattern: \"${ s }\"" )
      }
      assertEquals( s, duration.toString() )
    }
    catch ( ex )
    {
      if ( not exceptionExpected )
      {
        throw new RuntimeException( "Unexpected exception for pattern: \"${ s }\"", ex )
      }
    }
  }

  function tryExample( dateTime : AbstractXmlDateType, b : String, c : String )
  {
    var duration = new XmlDuration( b )
    dateTime.add( duration )
    assertEquals( c, dateTime.toString() )
  }

}