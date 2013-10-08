#!/usr/bin/ruby

# This script converts from osm xml into the json format needed for berries.
# The input file can be generated a number of different ways:
#  - Save the data from JOSM
#  - Overpass
#  - Generate it yourself from a postgresql database

require 'optparse'
require 'json'
require 'xmlsimple'
require 'pp'

options = {}

optparse = OptionParser.new do |opts|
	opts.banner = "Usage: osm2json.rb [options] file"

	options[:verbose] = false

	opts.on( '-o', '--output-file FILE', 'The file to write the results to' ) do |file|
		options[:outfile] = file
	end

	opts.on( '-h', '--help', 'Display this screen' ) do
		puts opts
		exit
	end
end

optparse.parse!

if ARGV.length > 1
	puts "Invalid number of arguments"
	puts optparse
	exit
end

puts 'Parsing in xml...'
hash = XmlSimple.xml_in(ARGV[0])
puts 'Done.'

outhash = {
	:schema_version => '0.1',
	:nodes => {},
	:ways => {},
	:relations => {}
}

puts 'Processing nodes...'
hash['node'].each { |node|
	id = node['id']
	lat = node['lat']
	lon = node['lon']
	tags = {}

	if node['tag']
		node['tag'].each { |tag|
			k = tag['k']
			v = tag['v']
			tags[k] = v
		}
	end

	outhash[:nodes][id] = {
		:lat => lat,
		:lon => lon,
		:tags => tags
	}
}
puts 'Done.'

puts 'Processing ways...'
hash['way'].each { |way|
	id = way['id']
	nodes = []
	if way['nd'] 
		way['nd'].each { |nd| 
			nodes.push(nd['ref'])
		}
	end
	tags = {}
	if way['tag']
		way['tag'].each { |tag|
			k = tag['k']
			v = tag['v']
			tags[k] = v
		}
	end

	outhash[:ways][id] = {
		:nodes => nodes,
		:tags => tags
	}
}
puts 'Done.'

puts 'Processing relations...'
hash['relation'].each { |relation|
	id = relation['id']
	members = {}

	if relation['member']
		relation['member'].each { |member|
			type = ''
			case member['type']
			when 'way'
				type = 'ways'
			when 'relation'
				type = 'relations'
			when 'node'
				type = 'nodes'
			end
			id = member['ref']
			role = member['role']


			if !members[type]
				members[type] = {}
			end
			members[type][id] = {
				:role => role
			}
		}
	end

	tags = {}
	if relation['tag']
		relation['tag'].each { |tag|
			k = tag['k']
			v = tag['v']
			tags[k] = v
		}
	end
}
puts 'Done.'

puts 'Writing to file...'
File.open(options[:outfile], 'w') { |file| file.write(outhash.to_json)}
puts 'Done.'


