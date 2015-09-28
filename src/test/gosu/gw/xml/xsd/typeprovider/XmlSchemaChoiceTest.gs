package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses org.junit.Test

class XmlSchemaChoiceTest {

  @Test
  function testChoiceWithAllOptionalComponents_MatchesEmpty() {
    var s = new Schema()
    s.Element[0].Name = "root"
    s.Element[0].ComplexType.Sequence.Element[0].Name = "first"
    s.Element[0].ComplexType.Sequence.Element[0].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    s.Element[0].ComplexType.Sequence.Choice[0].Element[0].Name = "second"
    s.Element[0].ComplexType.Sequence.Choice[0].Element[0].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    s.Element[0].ComplexType.Sequence.Choice[0].Element[0].MinOccurs = 0
    s.Element[0].ComplexType.Sequence.Choice[0].Element[1].Name = "third"
    s.Element[0].ComplexType.Sequence.Choice[0].Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    s.Element[0].ComplexType.Sequence.Choice[0].Element[1].MinOccurs = 0
    s.Element[0].ComplexType.Sequence.Element[1].Name = "fourth"
    s.Element[0].ComplexType.Sequence.Element[1].Type = gw.xsd.w3c.xmlschema.types.simple.Int.$QNAME
    s.print()

    XmlSchemaTestUtil.runWithResource(s, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.First = 5",
        "xml.Fourth = 10",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.First )",
        "assertNull( xml.Second )",
        "assertNull( xml.Third )",
        "assertEquals( 10, xml.Fourth )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.First )",
        "assertNull( xml.Second )",
        "assertNull( xml.Third )",
        "assertEquals( 10, xml.Fourth )"
    })
  }
}