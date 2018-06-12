<?php

namespace Tainacan\Tests;

/**
 * Class TestCollections
 *
 * @package Test_Tainacan
 */

use Tainacan\Entities;

/**
 * Sample test case.
 */
class CoreMetadatumTypes extends TAINACAN_UnitTestCase {

	
    function test_core_metadata_types() {

        $Tainacan_Item_Metadata = \Tainacan\Repositories\Item_Metadata::get_instance();
        $Tainacan_Items = \Tainacan\Repositories\Items::get_instance();
        
        $collection = $this->tainacan_entity_factory->create_entity(
			'collection',
			array(
                'name'   => 'test',
                'status' => 'publish'
			),
			true
		);
        
        $metadatum = $collection->get_core_title_metadatum();
        
        $metadatumDescription = $collection->get_core_description_metadatum();
        
        
        $i = $this->tainacan_entity_factory->create_entity(
           'item',
           array(
               'title'         => 'item test',
               'description'   => 'adasdasdsa',
               'collection'    => $collection,
               'status'        => 'publish'
           ),
           true
       );
       
       
       $item_metadata = new \Tainacan\Entities\Item_Metadata_Entity($i, $metadatum);
       $item_metadata->set_value('changed title');
       $item_metadata->validate();
       
       $Tainacan_Item_Metadata->insert($item_metadata);
       
       $checkItem = $Tainacan_Items->fetch($i->get_id());
       
       $this->assertEquals('changed title', $checkItem->get_title());
       
       $check_item_metadata = new \Tainacan\Entities\Item_Metadata_Entity($checkItem, $metadatum);
       $this->assertEquals('changed title', $check_item_metadata->get_value());
       
       
       // description
       $item_metadata = new \Tainacan\Entities\Item_Metadata_Entity($i, $metadatumDescription);
       $item_metadata->set_value('changed description');
       $item_metadata->validate();
       
       $Tainacan_Item_Metadata->insert($item_metadata);
       
       $checkItem = $Tainacan_Items->fetch($i->get_id());
       
       $this->assertEquals('changed description', $checkItem->get_description());
       
       $check_item_metadata = new \Tainacan\Entities\Item_Metadata_Entity($checkItem, $metadatumDescription);
       $this->assertEquals('changed description', $check_item_metadata->get_value());

       // check that the value was also stored in postmeta table
       $checkMeta = $Tainacan_Items->fetch([
           'meta_query' => [
               [
                   'key' => $metadatumDescription->get_id(),
                   'value' => 'changed description'
               ]
           ]
               ], [], 'OBJECT');

       $this->assertEquals(1, sizeof($checkMeta));
       $this->assertEquals('changed description', $checkMeta[0]->get_description());
       
    }

    function test_validate_required_title() {

        $Tainacan_Item_Metadata = \Tainacan\Repositories\Item_Metadata::get_instance();
        $Tainacan_Items = \Tainacan\Repositories\Items::get_instance();
        $Tainacan_Metadata = \Tainacan\Repositories\Metadata::get_instance();

        $collection = $this->tainacan_entity_factory->create_entity(
            'collection',
            array(
                'name'   => 'test',
            ),
            true
        );

        $i = $this->tainacan_entity_factory->create_entity(
            'item',
            array(
                'description'   => 'adasdasdsa',
                'collection'    => $collection,
                'status'        => 'draft'
            ),
            true
        );

        $metadata = $Tainacan_Metadata->fetch_by_collection( $collection, [], 'OBJECT' ) ;

        foreach ( $metadata as $index => $metadatum ){
            if ( $metadatum->get_metadata_type_object()->get_core() && $metadatum->get_metadata_type_object()->get_related_mapped_prop() == 'title') {
                $core_title = $metadatum;
            }
        }



        $item_metadata = new \Tainacan\Entities\Item_Metadata_Entity($i, $core_title);
        $item_metadata->set_value('title');
        $item_metadata->validate();
        $Tainacan_Item_Metadata->insert($item_metadata);

        $i->set_status('publish' );

        $this->assertTrue($i->validate(), 'Item with empy title should validate because core title metadatum has value');

    }

    function test_dont_allow_multiple() {

        $Tainacan_Item_Metadata = \Tainacan\Repositories\Item_Metadata::get_instance();
        $Tainacan_Items = \Tainacan\Repositories\Items::get_instance();
        $Tainacan_Metadata = \Tainacan\Repositories\Metadata::get_instance();

        $collection = $this->tainacan_entity_factory->create_entity(
            'collection',
            array(
                'name'   => 'test',
            ),
            true
        );

        $metadata = $Tainacan_Metadata->fetch_by_collection( $collection, [], 'OBJECT' ) ;

        foreach ( $metadata as $index => $metadatum ){
            if ( $metadatum->get_metadata_type_object()->get_core() && $metadatum->get_metadata_type_object()->get_related_mapped_prop() == 'title') {
                $core_title = $metadatum;
            }
            if ( $metadatum->get_metadata_type_object()->get_core() && $metadatum->get_metadata_type_object()->get_related_mapped_prop() == 'description') {
                $core_description = $metadatum;
            }
        }

        $core_title->set_multiple('yes');
        $core_description->set_multiple('yes');

        $this->assertFalse($core_title->validate(), 'Core metadata should not validate because it can not allow it to have multiple');
        $this->assertFalse($core_description->validate(), 'Core metadata should not validate because it can not allow it to have multiple');

    }

    function test_collection_getters() {

        $Tainacan_Collections = \Tainacan\Repositories\Collections::get_instance();
        
        $collection = $this->tainacan_entity_factory->create_entity(
			'collection',
			array(
				'name'   => 'test',
			),
			true
        );

        $metadatumDescription = $this->tainacan_entity_factory->create_entity(
        	'metadatum',
	        array(
	        	'name' => 'just to confuse',
		        'description' => 'description',
		        'collection' => $collection,
		        'metadata_type' => 'Tainacan\Metadata_Types\Text'
	        ),
	        true
        );
        
        $core_metadata = $collection->get_core_metadata();

        $this->assertEquals(2, sizeof($core_metadata));

        $this->assertNotEquals('Tainacan\Metadata_Types\Text', $core_metadata[0]->get_metadata_type());
        $this->assertNotEquals('Tainacan\Metadata_Types\Text', $core_metadata[1]->get_metadata_type());

        $title = $collection->get_core_title_metadatum();

        $this->assertEquals('Tainacan\Metadata_Types\Core_Title', $title->get_metadata_type());

        $description = $collection->get_core_description_metadatum();

        $this->assertEquals('Tainacan\Metadata_Types\Core_Description', $description->get_metadata_type());


    }
    
}