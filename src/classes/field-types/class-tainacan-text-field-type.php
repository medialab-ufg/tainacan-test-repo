<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class TainacanFieldType
 */
class Tainacan_Text_Field_Type extends Tainacan_Field_Type {

    function __construct(){
        $this->primitive_type = 'string';
    }

    /**
     * @param $metadata
     * @return string
     */

    function render( $metadata ){
        return '<tainacan-text name="'.$metadata->get_name().'"></tainacan-text>';
    }
}