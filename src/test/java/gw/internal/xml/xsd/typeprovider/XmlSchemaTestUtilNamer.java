package gw.internal.xml.xsd.typeprovider;

public class XmlSchemaTestUtilNamer {

    private static int _nextSchemaNumber = 0;

    public static String nextSchemaName() {
        String nextSchemaName = peekNextSchemaName();
        _nextSchemaNumber++;
        return nextSchemaName;
    }

    public static String peekNextSchemaName() {
        return "testschema" + _nextSchemaNumber;
    }

}
