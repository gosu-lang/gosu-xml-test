package gw.xml.xsd.typeprovider


uses org.junit.Test

class XmlSchemaNodeSortingTest extends XSDTest {

  @Test
  function testNothing() {
  }

  @Test
  function testNodeSorting() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "B"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "// assert order is wrong",
        "assertEquals( \"B\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"A\", xml.$Children[1].QName.LocalPart )",
        "// assert it gets sorted on output",
        "assertTrue( xml.asUTFString().contains( \"<A/>\\n  <B/>\" ) )",
        "// assert order did not actually change in the content list",
        "assertEquals( \"B\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"A\", xml.$Children[1].QName.LocalPart )",
        "// reparse",
        "xml = xml.parse( xml.bytes() )",
        "// check that order is now correct",
        "assertEquals( \"A\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"B\", xml.$Children[1].QName.LocalPart )"
    } )
  }

  @Test
  function testTypeInstanceIsUsedForSorting() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.ComplexType[0].Name = "MyType"
    schema.ComplexType[0].Sequence.Element[0].Name = "A"
    schema.ComplexType[0].Sequence.Element[1].Name = "B"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var myType = new $$TESTPACKAGE$$.schema.types.complex.MyType()",
        "var xml = new gw.xml.XmlElement( \"Foo\", myType )",
        "myType.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "myType.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "// assert order is wrong",
        "assertEquals( \"B\", xml.Children[0].QName.LocalPart )",
        "assertEquals( \"A\", xml.Children[1].QName.LocalPart )",
        "// assert it gets sorted on output",
        "assertTrue( xml.asUTFString().contains( \"<A/>\\n  <B/>\" ) )",
        "// assert order did not actually change in the content list",
        "assertEquals( \"B\", xml.Children[0].QName.LocalPart )",
        "assertEquals( \"A\", xml.Children[1].QName.LocalPart )",
        "// reparse",
        "xml = xml.parse( xml.bytes() )",
        "// check that order is now correct - we have to use 'Children' since there will now be whitespace contents",
        "assertEquals( \"A\", xml.Children[0].QName.LocalPart )",
        "assertEquals( \"B\", xml.Children[1].QName.LocalPart )"
    } )
  }

  @Test
  function testSortSequence() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "B"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"A\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"B\", xml.$Children[1].QName.LocalPart )"
    } )
  }

  // xs:all should never be affected by the sorting algorithm
  @Test
  function testSortAll() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.All.Element[0].Name = "A"
    schema.Element[0].ComplexType.All.Element[1].Name = "B"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"A\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"B\", xml.$Children[1].QName.LocalPart )",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"B\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"A\", xml.$Children[1].QName.LocalPart )"
    } )
  }

  // This used to be 10^n (estimated by pdalbora and dlank). This should be linear now.
  // Note: The "element" element in the schema schema is optional, that is what the "Optional" refers to in the test name
  @Test
  function testSortOutOfOrderElementInLargeOptionalSequence() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    for ( i in 0..|150) {
      if ( i == 75 ) {
        schema.Import[0].Namespace = new URI( "Foo" )
      }
      schema.Element[i].Name = "Element${i}"
    }
    schema.print()
  }

  // This used to be 10^n (estimated by pdalbora and dlank). This should be linear now.
  // Note: The "element" element in the schema schema is optional, that is what the "Optional" refers to in the test name
  @Test
  function testSortIllegalElementInLargeOptionalSequence() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    for ( i in 0..|150) {
      if ( i == 75 ) {
        schema.addChild( new XmlElement( "IllegalElementName" ) )
      }
      schema.Element[i].Name = "Element${i}"
    }
    try {
      schema.print()
      fail( "Expected XmlSortException" )
    }
    catch ( ex : XmlSortException ) {
      // good
    }
  }

  @Test
  function testSortChoiceChoosesCorrectChoice() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"

    schema.Element[0].ComplexType.Choice.Sequence[0].Element[0].Name = "A"
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[1].Name = "B"
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[2].Name = "C"

    schema.Element[0].ComplexType.Choice.Sequence[1].Element[0].Name = "B"
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[1].Name = "C"
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[2].Name = "A"
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[3].Name = "Q"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml = xml.parse( \"<Root><B/><C/><A/><Q/></Root>\" )",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.C.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"A\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"B\", xml.$Children[1].QName.LocalPart )",
        "assertEquals( \"C\", xml.$Children[2].QName.LocalPart )",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.C.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.Q.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"B\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"C\", xml.$Children[1].QName.LocalPart )",
        "assertEquals( \"A\", xml.$Children[2].QName.LocalPart )",
        "assertEquals( \"Q\", xml.$Children[3].QName.LocalPart )"
    } )
  }

  @Test
  function testSortChoiceChoosesChoiceThatMatchesOriginalOrderThatPropertiesWereSet() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"

    schema.Element[0].ComplexType.Choice.Sequence[0].Element[0].Name = "A"
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[1].Name = "B"

    schema.Element[0].ComplexType.Choice.Sequence[1].Element[0].Name = "B"
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[1].Name = "A"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"B\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"A\", xml.$Children[1].QName.LocalPart )",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"A\", xml.$Children[0].QName.LocalPart )",
        "assertEquals( \"B\", xml.$Children[1].QName.LocalPart )"
    } )
  }

  @Test
  function testSortWithExtraElementsThrowsException() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"

    schema.Element[0].ComplexType.Choice.Sequence[0].Element[0].Name = "A"
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[1].Name = "B"

    schema.Element[0].ComplexType.Choice.Sequence[1].Element[0].Name = "B"
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[1].Name = "C"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.A.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.B.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.C.$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "try {",
        "  xml.asUTFString()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "}"
    } )
  }

  @Test
  function testEmptyChoice() {
    // this used to result in an ArrayIndexOutOfBoundsException
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Choice.MinOccurs = 0
    schema.Element[0].ComplexType.Choice.MaxOccurs = "unbounded"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.print()"
    } )
  }

  @Test
  function testPluralChoiceWithOptionalElement() {
    // this used to result in an infinite condition, eventually leading to OutOfMemoryError
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Choice.MinOccurs = 0
    schema.Element[0].ComplexType.Choice.MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Choice.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Choice.Element[0].MinOccurs = 0
    schema.Element[0].ComplexType.Choice.Element[0].MaxOccurs = "unbounded"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.print()"
    } )
  }

//
//  function testSortComplexSubtype() {
//    var schema = new gw.xsd.w3c.xmlschema.Schema()
//    schema.Element[0].Name = "Root"
//    schema.Element[0].Type = new QName( "BaseType" )
//    schema.ComplexType[0].Name = "BaseType"
//    schema.ComplexType[0].Sequence.Element[0].Name = "Child"
//    schema.ComplexType[0].Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
//    schema.ComplexType[1].Name = "SubType"
//    schema.ComplexType[1].ComplexContent.Extension.Base = new QName( "BaseType" )
//    schema.ComplexType[1].ComplexContent.Extension.Sequence.Element[0].Name = "Child"
//    schema.ComplexType[1].ComplexContent.Extension.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
//    XmlSchemaTestUtil.runWithResource( schema, {
//    } )
//  }

  @Test
  function testSortLargeMinOccursZeroBlock() {
    var max = 100
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    for ( i in 0..max ) {
      schema.Element[0].ComplexType.Sequence.Element[i].Name = "Test${i}"
      schema.Element[0].ComplexType.Sequence.Element[i].Type = schema.$Namespace.qualify( "int" )
      schema.Element[0].ComplexType.Sequence.Element[i].MinOccurs = 0
      schema.Element[0].ComplexType.Sequence.Element[i].MaxOccurs = "42"
    }

    (1..10).step(2)
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "for ( i in (0..${ max }).step(2) ) {",
        "  var list = new java.util.ArrayList<java.lang.Integer>()",
        "  list.add( 5 )",
        "  xml[\"Test\" + i] = list",
        "}",
        "var startTime = java.lang.System.currentTimeMillis()",
        "print( \"Beginning sort...\" )",
        "xml.print()",
        "print( \"Completed in \" + ( java.lang.System.currentTimeMillis() - startTime ) + \" ms\" )"
    } )

  }

  @Test
  function testSortLargeSequenceOfChoices() {
    var max = 100
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    for ( i in 0..max ) {
      for ( j in 0..10 ) {
        schema.Element[0].ComplexType.Sequence.Choice[i].Element[j].Name = "Test${j}"
        schema.Element[0].ComplexType.Sequence.Choice[i].Element[j].Type = schema.$Namespace.qualify( "int" )
      }
    }
    // this should either work or fail the suite due to an improper algorithm
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "for ( i in 0..${ max } ) {",
        "  xml.Test5[i] = 5",
        "}",
        "var startTime = java.lang.System.currentTimeMillis()",
        "print( \"Beginning sort...\" )",
        "xml.print()",
        "print( \"Completed in \" + ( java.lang.System.currentTimeMillis() - startTime ) + \" ms\" )"
    } )

  }

  @Test
  function testSortXmlSchemaSchema() {
    var is = gw.xsd.w3c.xmlschema.Schema.Type.TypeLoader.Module.FileRepository.findFirstFile( "gw/xsd/w3c/XMLSchema.xsd" ).openInputStream()
    try {
      // if this schema gets sorted wrong, it won't validate depending on how it gets sorted incorrectly
      var schema = gw.xsd.w3c.xmlschema.Schema.parse( is )
      var startTime = System.currentTimeMillis()
      var bytes = schema.bytes()
      print( "Sorted schema in ${ System.currentTimeMillis() - startTime } ms" )
      schema = schema.parse( bytes )
      schema.asUTFString()
    } finally {
      is.close()
    }
  }

  @Test
  function testAllElementsGetSortedIfAnyAreOutOfOrder() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "ElementBeforeChoice"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Choice[0].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Name = "Choice1"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[1].Name = "Choice2"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[1].MinOccurs = 0

    // this used to be 1 1 2 2 2, but an optimization to the sort algorithm incidentally prevented the
    // choices from being sorted relative to each other, which is fine and even preferred,
    // resulting in 2 1 2 2 1 (the same as the input)
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Choice2[0] = 1",
        "xml.Choice1[0] = 2",
        "xml.Choice2[1] = 3",
        "xml.ElementBeforeChoice = 4",
        "xml.Choice2[2] = 5",
        "xml.Choice1[1] = 6",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_ElementBeforeChoice, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Choice2, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Choice1, typeof xml.$Children[2] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Choice2, typeof xml.$Children[3] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Choice2, typeof xml.$Children[4] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Choice1, typeof xml.$Children[5] )"
    } )

    var xml = new gw.xsd.w3c.xmlschema.Schema()
    xml.Element[0].Name = "MyElement"
    xml.Import[0].Namespace = new URI( "http://guidewire.com" )
    xml.ComplexType[0].Name = "MyType"

    xml = xml.parse( xml.bytes() )

    assertEquals( gw.xsd.w3c.xmlschema.Import, typeof xml.$Children[0] )
    assertEquals( gw.xsd.w3c.xmlschema.ComplexType, typeof xml.$Children[1] )
    assertEquals( gw.xsd.w3c.xmlschema.Element, typeof xml.$Children[2] )

    xml = new gw.xsd.w3c.xmlschema.Schema()
    xml.ComplexType[0].Name = "MyType"
    xml.Import[0].Namespace = new URI( "http://guidewire.com" )
    xml.Element[0].Name = "MyElement"

    xml = xml.parse( xml.bytes() )

    assertEquals( gw.xsd.w3c.xmlschema.Import, typeof xml.$Children[0] )
    assertEquals( gw.xsd.w3c.xmlschema.ComplexType, typeof xml.$Children[1] )
    assertEquals( gw.xsd.w3c.xmlschema.Element, typeof xml.$Children[2] )

  }

  @Test
  function testComplexSortOfElements() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"

    schema.Element[0].ComplexType.Sequence.Element[0].Name = "One"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[0].MinOccurs = 0

    schema.Element[0].ComplexType.Sequence.Element[1].Name = "Two"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].MaxOccurs = "unbounded"

    schema.Element[0].ComplexType.Sequence.Element[2].Name = "Three"
    schema.Element[0].ComplexType.Sequence.Element[2].Type = schema.$Namespace.qualify( "int" )

    schema.Element[0].ComplexType.Sequence.Choice[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Choice[0].MaxOccurs = "unbounded"

    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Name = "Four"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[0].Type = schema.$Namespace.qualify( "int" )

    schema.Element[0].ComplexType.Sequence.Choice[0].Element[1].Name = "Three"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[1].Type = schema.$Namespace.qualify( "int" )

    schema.Element[0].ComplexType.Sequence.Choice[0].Element[2].Name = "Five"
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[2].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[2].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Choice[0].Element[2].MaxOccurs = "unbounded"

    schema.Element[0].ComplexType.Sequence.Element[3].Name = "Six"
    schema.Element[0].ComplexType.Sequence.Element[3].Type = schema.$Namespace.qualify( "int" )

    schema.Element[0].ComplexType.Sequence.Element[4].Name = "Seven"
    schema.Element[0].ComplexType.Sequence.Element[4].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[4].MaxOccurs = "unbounded"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Seven[0] = 1",
        "xml.Four[0] = 2",
        "xml.Three[0] = 3",
        "xml.Two[0] = 4",
        "xml.Seven[1] = 5",
        "xml.One = 6",
        "xml.Six = 7",
        "xml.Seven[2] = 8",
        "xml.Five[0] = 9",
        "xml.Two[1] = 10",
        "xml.Three[1] = 11",
        "xml.Two[2] = 12",
        "xml.print()",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_One, typeof xml.$Children[0] )",
        "assertEquals( \"6\", xml.$Children[0].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Two, typeof xml.$Children[1] )",
        "assertEquals( \"4\", xml.$Children[1].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Two, typeof xml.$Children[2] )",
        "assertEquals( \"10\", xml.$Children[2].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Two, typeof xml.$Children[3] )",
        "assertEquals( \"12\", xml.$Children[3].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Three, typeof xml.$Children[4] )",
        "assertEquals( \"3\", xml.$Children[4].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Four, typeof xml.$Children[5] )",
        "assertEquals( \"2\", xml.$Children[5].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Three, typeof xml.$Children[6] )",
        "assertEquals( \"11\", xml.$Children[6].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Five, typeof xml.$Children[7] )",
        "assertEquals( \"9\", xml.$Children[7].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Six, typeof xml.$Children[8] )",
        "assertEquals( \"7\", xml.$Children[8].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Seven, typeof xml.$Children[9] )",
        "assertEquals( \"1\", xml.$Children[9].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Seven, typeof xml.$Children[10] )",
        "assertEquals( \"5\", xml.$Children[10].Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Seven, typeof xml.$Children[11] )",
        "assertEquals( \"8\", xml.$Children[11].Text )"
    } )

  }

  // an empty choice can never be satisfied according to the spec since there is no way to choose one of the choices since zero are available
  @Test
  function testEmptyChoiceIsNotSatisfied() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Choice = new gw.xsd.w3c.xmlschema.Choice()

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertTrue( ex.Cause.Message.contains( \"choice\" ) )",
        "}"
    } )
  }

  @Test
  function testEmptyChoiceOfEmptyChoiceIsNotSatisfied() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Choice.Choice[0] = new gw.xsd.w3c.xmlschema.Choice()

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertTrue( ex.Cause.Message.contains( \"choice\" ) )",
        "}"
    } )
  }

  @Test
  function testEmptyChoiceWithMinOccursZeroPasses() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Choice = new gw.xsd.w3c.xmlschema.Choice()
    schema.Element[0].ComplexType.Choice.MinOccurs = 0

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.print()"
    } )
  }

  // This used to cause an infinite loop in the sorting mechanism, eventually throwing an OutOfMemoryError
  @Test
  function testJira_PL11696() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "B"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.A[0] = 5",
        "xml.B[0] = 5",
        "xml.A[1] = 5",
        "xml.B[1] = 5",
        "xml.A[2] = 5", // intentionally missing xml.B[2]
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  assertTrue( ex.Cause.Message.contains( \"Extra elements found: [$$TESTPACKAGE$$.schema.anonymous.elements.Root_A instance]\" ) )",
        "}"
    } )
  }

  // This used to cause an infinite loop in the sorting mechanism, eventually throwing an OutOfMemoryError
  @Test
  function testJira_PL11696_2() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[0].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[0].Element[0].Name = "S11a"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[0].Element[1].Name = "S11b"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[1].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[1].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[1].Element[0].Name = "S12a"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Sequence[1].Element[1].Name = "S12b"
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[0].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[0].Element[0].Name = "S21a"
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[0].Element[1].Name = "S21b"
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[1].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[1].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[1].Element[0].Name = "S22a"
    schema.Element[0].ComplexType.Sequence.Sequence[1].Sequence[1].Element[1].Name = "S22b"
    schema.print()
    print("")

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.S11a[0].$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.S11b[0].$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.S12a[0].$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.S12b[0].$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.S21a[0].$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.S21b[0].$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "xml.S22a[0].$TypeInstance = new gw.xsd.w3c.xmlschema.types.complex.AnyType()",
        "try {",
        "  xml.bytes()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // Good!",
        "  assertTrue( ex.Cause.Message.contains( \"Extra elements found\" ) )",
        "}"
    } )
  }

  @Test
  function testSortLargeSequenceWithElementOutOfPlace() {
    // This would previously fail the suite due to suite timeout
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[0].MinOccurs = 0
    schema.Element[0].ComplexType.Sequence.Element[0].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "child2"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = ( 1..250 ).map( \\ i -> i ) ",
        "xml.Child2 = 12345",
        "xml = xml.parse( xml.bytes() )" // not a debugging statement
    } )
  }

  @Test
  function testSubstitutionGroupMemberIsMatched() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[1].Ref = new QName( "head" )
    schema.Element[1].Name = "head"
    schema.Element[2].Name = "member"
    schema.Element[2].SubstitutionGroup = new QName( "head" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Head = new $$TESTPACKAGE$$.schema.Member()",
        "xml.Child = new $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child()",
        "assertEquals( $$TESTPACKAGE$$.schema.Member, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.$Children[1] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member, typeof xml.$Children[1] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member, typeof xml.$Children[1] )"
    } )
  }

  // Before the fix for PL-15865, this would loop for a very long time and fail the suite
  @Test
  function testMissingElementCausesEarlyFailure() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    for ( i in 0..100 ) {
      schema.Element[0].ComplexType.Sequence.Any[i].ProcessContents = Skip
    }
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "child2"

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()",
          "for ( i in 0..100 ) {",
          "  eval( 'xml.$Children.add( new $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child() )' )",
          "}",
          "xml.parse( xml.bytes() )"
      } )
      fail( "Expected XmlSortException" )
    }
    catch ( ex : XmlSortException ) {
      // good
      assertEquals( ex.Message, "Unable to process children of element root. Expected one of {child2}" )
    }
  }

}