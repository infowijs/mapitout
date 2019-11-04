import xml.etree.ElementTree as ET
NS = {'ns1': 'http://bison.connekt.nl/tmi8/chb/msg/v1.4'}


def strip_ns(xmltag):
    try:
        return xmltag.split('}', 1)[1]
    except Exception:
        return xmltag


xml_file = "ExportCHB20190411010001.xml"
csv_file_output = '{}_out.csv'.format(xml_file)

print('loading')
tree = ET.ElementTree(ET.parse(xml_file))
print('parse')
xml_root = tree.getroot()

# <ns1:export xmlns:ns1="http://bison.connekt.nl/tmi8/chb/msg/v1.4">
#    <ns1:stopplaces>
#        <ns1:stopplace>
#            <ns1:validfrom>2015-05-03T00:00:00Z</ns1:validfrom>
#            <ns1:stopplacecode>NL:S:15005330</ns1:stopplacecode>
#            <ns1:stopplacetype>onstreetBus</ns1:stopplacetype>

print('loop')
with open(csv_file_output, 'w') as fout:
    fout.write("Id,Type")
    root = xml_root.find("ns1:stopplaces", NS)
    for row in root.iterfind("ns1:stopplace", NS):
        code = row.find("ns1:stopplacecode", NS)
        fcode = code.text.split(':')[-1]
        code_type = row.find("ns1:stopplacetype", NS)
        fout.write('\n{0},{1}'.format(fcode, code_type.text))
