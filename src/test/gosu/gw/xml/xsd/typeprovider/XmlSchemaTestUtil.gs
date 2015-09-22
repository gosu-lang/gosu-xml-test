package gw.xml.xsd.typeprovider

uses java.util.ArrayList
uses gw.lang.reflect.TypeSystem
uses gw.lang.parser.GosuParserFactory
uses java.lang.Throwable
uses java.util.Collection
uses gw.fs.IFile
uses gw.fs.IResource
uses java.io.IOException
uses gw.xml.XmlElement
uses gw.internal.xml.xsd.typeprovider.XmlSchemaResourceTypeLoader
uses gw.xml.date.XmlDuration
uses gw.xml.BinaryData
uses gw.xml.XmlBase
uses gw.xsd.w3c.wsdl.Definitions
uses gw.xsd.w3c.xmlschema.Schema
uses gw.fs.IDirectory
uses gw.xml.XmlSerializationOptions
uses junit.framework.Assert
uses gw.internal.xml.xsd.typeprovider.XmlSchemaResourceTypeLoaderBase
uses java.lang.Class
uses gw.lang.reflect.ITypeLoader
uses java.net.URI


class XmlSchemaTestUtil {

  static function runWithResource( resource : XmlElement, code : String[] ) {
    runWithResources( { resource }, code )
  }

  static function runWithResources( resources : List<XmlElement>, code : String[] ) : Object {
    var nextSchemaNumber = 1
    var nextWsdlNumber = 1
    var nextGxModelNumber = 1
    var filenames = new ArrayList<String>()
    for ( resource in resources ) {
      if ( resource typeis Schema ) {
        filenames.add( "schema${ numberToString( nextSchemaNumber ) }.xsd" )
        nextSchemaNumber++
      }
      else if ( resource typeis Definitions ) {
        filenames.add( "wsdl${ numberToString( nextWsdlNumber ) }.wsdl" )
        nextWsdlNumber++
      }
//      else if ( resource typeis GxModel ) {
//        filenames.add( "model${ numberToString( nextGxModelNumber ) }.gx" )
//        nextGxModelNumber++
//      }
    }
    return runWithResources( resources, filenames, code )
  }

  static function runWithResources( resources : List<XmlElement>, filenames : List<String>, code : String[] ) : Object {
    return runWithResources( resources, filenames, code, new XmlSerializationOptions() )
  }

  static function runWithResources( resources : List<XmlElement>, filenames : List<String>, code : String[], options : XmlSerializationOptions ) : Object {
    var foundSchemas = {} as List<IFile>
    var foundWsdls = {} as List<IFile>
    var foundGxModels = {} as List<IFile>
    var ex : Throwable
    var ret : Object
    var topLevelPackageName = gw.internal.xml.xsd.typeprovider.XmlSchemaTestUtilNamer.nextSchemaName()
    print( "Using temporary schema package ${topLevelPackageName}..." )
    var files = new ArrayList<String>()
    var bl =  \ namespace : String, file : IFile, t : Throwable ->{
      if ( files.contains( file.Path.FileSystemPathString ) ) {
        ex = t
      }
    } as gw.internal.xml.xsd.typeprovider.IXmlSchemaExceptionListener
    XmlSchemaResourceTypeLoader.addExceptionListener( bl )
    try {
      var filesToDelete = new ArrayList<IResource>()
      try {
        var dir = TypeSystem.getGlobalModule().SourcePath.where(\elt -> elt.Name.equals('classes')).first()
        print( "Creating schema in source path directory ${dir}" )
        if ( dir.mkdir() )
        {
          filesToDelete.add( dir )
        }
        var xsdPackage = dir.dir( topLevelPackageName )
        if ( xsdPackage.mkdir() )
        {
          filesToDelete.add( xsdPackage )
        }
        for ( resource in resources index schemaNumber ) {
          var xsdFile = xsdPackage.file( filenames[ schemaNumber ] )
          filesToDelete.add( xsdFile )

          if ( xsdFile.exists() ) {
            xsdFile.delete()
            xsdFile.Parent.clearCaches()  // in case it exists from last run
          }

          if ( xsdFile.exists() ) {
            throw new IOException( "Unable to delete file ${xsdFile.Path}" )
          }

          TypeSystem.getAllTypeNames() // writeTo(), below, will call getAllTypeNames() with the schema only partially written

          mkdirs( xsdFile.Parent, filesToDelete )

          // create xsd
          using ( var out = xsdFile.openOutputStream() ) {
            resource.writeTo( out, options )
          }

          files.add( xsdFile.Path.FileSystemPathString )

          switch ( xsdFile.Extension ) {
            case "xsd": foundSchemas.add( xsdFile ); break
            case "wsdl": foundWsdls.add( xsdFile ); break
            case "gx": foundGxModels.add( xsdFile ); break
          }

        }

        filesToDelete.each(\f -> f.Parent.clearCaches())

        TypeSystem.clearErrorTypes()

        if ( foundSchemas.size() > 0 ) {
          TypeSystem.getTypeLoader( XmlSchemaResourceTypeLoader ).addSchemas( foundSchemas )
        }

        if ( foundGxModels.size() > 0 ) {
          var tl = TypeSystem.getTypeLoader( Class.forName("com.guidewire.commons.system.gx.GXTypeLoader") as Class<ITypeLoader>)
          (tl as XmlSchemaResourceTypeLoaderBase).addSchemas( foundGxModels )
        }

        if ( foundWsdls.size() > 0 ) {
//          TypeSystem.getTypeLoader( WsdlTypeLoader ).addSchemas( foundWsdls )
        }

        TypeSystem.clearErrorTypes()

        TypeSystem.getAllTypeNames() // force all schemas to be reparsed

        var codeString = code.join("\n") +
            "\n\nfunction displayEditor() {\n" +
            "  new javax.swing.JFrame().setVisible( true )\n" +
            "  java.lang.Thread.sleep( java.lang.Integer.MAX_VALUE )\n" +
            "}"

        codeString = codeString.replaceAll("assertEquals\\(", "junit.framework.Assert.assertEquals\\(")
        codeString = codeString.replaceAll("assertSame\\(", "junit.framework.Assert.assertSame\\(")
        codeString = codeString.replaceAll("assertTrue\\(", "junit.framework.Assert.assertTrue\\(")
        codeString = codeString.replaceAll("assertFalse\\(", "junit.framework.Assert.assertFalse\\(")
        codeString = codeString.replaceAll("assertNull\\(", "junit.framework.Assert.assertNull\\(")
        codeString = codeString.replaceAll("assertNotNull\\(", "junit.framework.Assert.assertNotNull\\(")
        codeString = codeString.replaceAll("fail\\(", "junit.framework.Assert.fail\\(")
        codeString = codeString.replaceAll("assertThat\\(\\)", "new com.guidewire.testharness.assertion.AssertionHelperFactory\\(\\)")
        codeString = codeString.replaceAll("assertExceptionThrown\\(", "gw.xml.xsd.typeprovider.XmlSchemaTestUtil.assertExceptionThrown\\(")
        codeString = codeString.replaceAll("assertEmpty\\(", "gw.xml.xsd.typeprovider.XmlSchemaTestUtil.assertEmpty\\(")
        codeString = codeString.replace( "$$TESTPACKAGE$$", topLevelPackageName )
        var parser = GosuParserFactory.createParser( codeString )
        var program = parser.parseProgram( null )
        ret = program.evaluate()
      }
      finally
      {
        TypeSystem.getAllTypeNames() // ensure schema is totally loaded before deleting the files on disk
        // you can set a breakpoint here to take a look at the generated files before they are deleted
        filesToDelete.reverse().each( \ f -> {
          if ( f.JavaFile ) {
            f.toJavaFile().deleteRecursively()
          }
          else {
            f.delete()
          }
        } )
        filesToDelete.each( \f ->f.Parent.clearCaches() )
      }
    }
    catch ( t : Throwable ) {
      if ( ex == null ) {
        ex = t
      }
    }
    finally {
      XmlSchemaResourceTypeLoader.removeExceptionListener( bl )
    }
    if ( ex != null ) {
      throw ex
    }
    return ret
  }

  static function mkdirs( dir : IDirectory, filesToDelete : ArrayList<IResource> ) {
    if ( ! dir.exists() ) {
      filesToDelete.add( dir )
      mkdirs( dir.Parent, filesToDelete )
      dir.mkdir()
    }
  }

  static function numberToString( number : int ) : String {
    return number == 1 ? "" : number as String
  }

  public static function assertExceptionThrown( callback : block(), exceptionType : Type) {
    try {
      callback()
      junit.framework.Assert.fail("Expected an exception to be thrown")
    } catch (e : Throwable) {
      //assertThat().exception(e).isOfClass(exceptionType)
      Assert.assertEquals(typeof e, exceptionType)
    }
  }

  static function assertEmpty( collection : Collection ) {
    junit.framework.Assert.assertTrue( collection.Empty )
  }

  static function areSimpleTypesEqual( o1 : Object, o2 : Object ) : String {
    if ( o1 typeis XmlDuration and o2 typeis XmlDuration ) {
      if ( o1.toString() == o2.toString() ) {
        return null
      }
      else {
        return "XmlDurations not equal"
      }
    }
    if ( o1 typeis BinaryData and o2 typeis BinaryData ) {
      return areSimpleTypesEqual( o1.Bytes, o2.Bytes )
    }
    if ( o1 typeis List and o2 typeis List ) {
      if ( o1.Count != o2.Count ) {
        var i1 = o1 // workaround for PL-12633
        var i2 = o2
        return "Lists were different sizes ( ${ i1.Count } != ${ i2.Count } )"
      }
      var it1 = o1.iterator()
      var it2 = o2.iterator()
      while ( it1.hasNext() ) {
        var result = areSimpleTypesEqual( it1.next(), it2.next() )
        if ( result != null ) {
          return result
        }
      }
      return null
    }
    if ( ( typeof o1 ).Array and ( typeof o2 ).Array ) {
      if ( ( typeof o1 ) != ( typeof o2 ) ) {
        return "Arrays were different types ( ${ typeof o1 } != ${ typeof o2 } )"
      }
      var o1ctype = ( typeof o1 ).ComponentType
      var o2ctype = ( typeof o2 ).ComponentType
      var o1size = o1ctype.getArrayLength( o1 )
      var o2size = o1ctype.getArrayLength( o2 )
      if ( o1size != o2size ) {
        return "Arrays were different sizes ( ${ o1size } != ${ o2size } )"
      }
      var idx = 0
      while ( idx < o1size ) {
        var o1item = o1ctype.getArrayComponent( o1, idx )
        var o2item = o2ctype.getArrayComponent( o2, idx )
        var result = areSimpleTypesEqual( o1item, o2item )
        if ( result != null ) {
          return result
        }
        idx++
      }
      return null
    }
    if ( o1 typeis XmlBase and o2 typeis XmlBase ) {
      var x1 = o1
      var x2 = o2
      if ( typeof o1 != typeof o2 ) {
        return "XmlBase types did not match ( ${ typeof x1 } != ${ typeof x2 } )"
      }
      if ( o1 typeis XmlElement and o2 typeis XmlElement ) {
        if ( o1.QName != o2.QName ) {
          var xe1 = o1 // workaround for PL-12633
          var xe2 = o2
          return "QNames did not match ( ${ xe1.QName } != ${ xe2.QName } )"
        }
      }
      if ( o1.AttributeNames.Count != o2.AttributeNames.Count ) {
        return "Attribute lists were different sizes. Expected: ${ x1.AttributeNames } Actual: ${ x2.AttributeNames }"
      }
      if ( o1.Children.Count != o2.Children.Count ) {
        return "Children lists were different sizes. Expected: ${ x1.Children } Actual: ${ x2.Children }"
      }
      var it1 = o1.Children.iterator()
      var it2 = o2.Children.iterator()
      while ( it1.hasNext() ) {
        var result = areSimpleTypesEqual( it1.next(), it2.next() )
        if ( result != null ) {
          return result
        }
      }
      return null
    }
    if ( o1 == o2 ) {
      return null
    }
    else {
      return "Objects were not equal. Expected: ${ o1 } ( ${ typeof o1 } ) Actual: ${ o2 } ( ${ typeof o2 } )"
    }
  }

  public static function toURI( s : String ) : URI {
    return s == null ? null : new URI( s )
  }

  public static function namespacesEqual( ns1 : String, ns2 : String ) : boolean {
    if ( ns1 == null ) {
      ns1 = ""
    }
    if ( ns2 == null ) {
      ns2 = ""
    }
    return ns1.equals( ns2 )
  }
}