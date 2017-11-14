<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class TainacanFieldType
 */
class Tainacan_Numeric_Field_Type extends Tainacan_Field_Type {

    function __construct(){
        $this->primitive_type = 'float';
    }

    /**
     * @param $metadata
     * @return string
     */

    function render( $metadata ){
        return '<tainacan-numeric name="'.$metadata->get_name().'"></tainacan-numeric>';
    }
}