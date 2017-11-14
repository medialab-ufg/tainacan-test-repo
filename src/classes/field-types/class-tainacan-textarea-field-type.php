<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class TainacanFieldType
 */
class Tainacan_Textarea_Field_Type extends Tainacan_Field_Type {

    function __construct(){
        $this->primitive_type = 'string';
    }

    /**
     * @param $metadata
     * @return string
     */

    function render( $metadata ){
        return '<tainacan-textarea name="'.$metadata->get_name().'"></tainacan-textarea>';
    }
}