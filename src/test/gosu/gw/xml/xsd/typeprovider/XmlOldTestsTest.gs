package gw.xml.xsd.typeprovider

uses org.junit.Test


class XmlOldTestsTest extends XSDTest {

  @Test
  function testNothing() {
  }

  @Test
  function testRootWithSingleChoiceGrouping() {
    // single grouping disappears, and its children appear directly under the root
    var xml = new gw.api.xml.parser2.xsd.typeloader.xsd.xsdrootgroupingtest.RootWithSingleChoice()
    assertNull( xml.Foo )
    assertNull( xml.Bar )
    xml.Foo = "blah"
    assertEquals( "blah", xml.Foo )
    assertNull( xml.Bar )
    xml = xml.parse( xml.asUTFString() )
    assertEquals( "blah", xml.Foo )
    assertNull( xml.Bar )
  }

  @Test
  function testRootWithSingleSequenceGrouping() {
    // single grouping disappears, and its children appear directly under the root
    var xml = new gw.api.xml.parser2.xsd.typeloader.xsd.xsdrootgroupingtest.RootWithSingleSequence()
    assertNull( xml.Foo )
    assertNull( xml.Bar )
    assertNull( xml.Baz )
    xml.Foo = "blah"
    xml.Baz = "1234"
    assertEquals( "blah", xml.Foo )
    assertNull( xml.Bar )
    assertEquals( "1234", xml.Baz )
    xml = xml.parse( xml.asUTFString() )
    assertEquals( "blah", xml.Foo )
    assertNull( xml.Bar )
    assertEquals( "1234", xml.Baz )
  }

  //TODO - API CHANGE
//  function testRootWithMultipleChoiceGroupings() {
//    var xml = new gw.api.xml.parser2.xsd.typeloader.xsd.xsdrootgroupingtest.RootWithMultipleChoices()
//
//    xml.Choices = { new gw.api.xml.parser2.xsd.typeloader.xsd.xsdrootgroupingtest.RootWithMultipleChoices_Choice(),
//        new gw.api.xml.parser2.xsd.typeloader.xsd.xsdrootgroupingtest.RootWithMultipleChoices_Choice(),
//        new gw.api.xml.parser2.xsd.typeloader.xsd.XSDRootGroupingTest.RootWithMultipleChoices_Choice() }
//
//    xml.Choices[0].Foo = "blah"
//    xml.Choices[1].Baz = "1234"
//    xml.Choices[2].Foo = "5678"
//
//    assertEquals( "blah", xml.Choices[0].Foo )
//    assertNull( xml.Choices[0].Bar )
//    assertNull( xml.Choices[0].Baz )
//
//    assertNull( xml.Choices[1].Foo )
//    assertNull( xml.Choices[1].Bar )
//    assertEquals( "1234",  xml.Choices[1].Baz )
//
//    assertEquals( "5678", xml.Choices[2].Foo )
//    assertNull( xml.Choices[2].Bar )
//    assertNull( xml.Choices[2].Baz )
//
//    xml = xml.parse( xml.asUTFString() )
//
//    assertEquals( "blah", xml.Choices[0].Foo )
//    assertNull( xml.Choices[0].Bar )
//    assertNull( xml.Choices[0].Baz )
//
//    assertNull( xml.Choices[1].Foo )
//    assertNull( xml.Choices[1].Bar )
//    assertEquals( "1234",  xml.Choices[1].Baz )
//
//    assertEquals( "5678", xml.Choices[2].Foo )
//    assertNull( xml.Choices[2].Bar )
//    assertNull( xml.Choices[2].Baz )
//  }
//
//  function testRootWithMultipleSequenceGroupings() {
//    var xml = new gw.api.xml.parser2.xsd.typeloader.xsd.XSDRootGroupingTest.RootWithMultipleSequences()
//    xml.Sequences = { new gw.api.xml.parser2.xsd.typeloader.xsd.XSDRootGroupingTest.RootWithMultipleSequences_Sequence(), new gw.api.xml.parser2.xsd.typeloader.xsd.XSDRootGroupingTest.RootWithMultipleSequences_Sequence(), new gw.api.xml.parser2.xsd.typeloader.xsd.XSDRootGroupingTest.RootWithMultipleSequences_Sequence() }
//    xml.Sequences[0].Foo = "blah"
//    xml.Sequences[1].Baz = "1234"
//    xml.Sequences[2].Foo = "5678"
//
//    assertSize( 3, xml.Sequences )
//
//    assertEquals( "blah", xml.Sequences[0].Foo )
//    assertNull( xml.Sequences[0].Bar )
//    assertNull( xml.Sequences[0].Baz )
//
//    assertNull( xml.Sequences[1].Foo )
//    assertNull( xml.Sequences[1].Bar )
//    assertEquals( "1234", xml.Sequences[1].Baz )
//
//    assertEquals( "5678", xml.Sequences[2].Foo )
//    assertNull( xml.Sequences[2].Bar )
//    assertNull( xml.Sequences[2].Baz )
//
//    xml = xml.parse( xml.asUTFString() )
//
//    // after reparse, only 2 sequences remain... blah, 1234  and 5678
//
//    assertSize( 2, xml.Sequences )
//
//    assertEquals( "blah", xml.Sequences[0].Foo )
//    assertNull( xml.Sequences[0].Bar )
//    assertEquals( "1234", xml.Sequences[0].Baz )
//
//    assertEquals( "5678", xml.Sequences[1].Foo )
//    assertNull( xml.Sequences[1].Bar )
//    assertNull( xml.Sequences[1].Baz )
//
//  }

}