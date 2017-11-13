<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}



class Tainacan_Filters {

    const POST_TYPE = 'tainacan-filters';

    var $map = [
        'ID' => [
            'map' => 'ID',
            'validation' => ''
        ],
        'name' => [
            'map' => 'post_title',
            'validation' => ''
        ],
        'order' => [
            'map' => 'menu_order',
            'validation' => ''
        ],
        'description' => [
            'map' => 'post_content',
            'validation' => ''
        ],
        'widget' => [
            'map' => 'meta',
            'validation' => ''
        ],
        'mask' => [
            'map' => 'meta',
            'validation' => ''
        ],
        'option' => [
            'map' => 'meta',
            'validation' => ''
        ],
        'collection_id' => [
            'map' => 'meta',
            'validation' => ''
        ],
    ];

    function __construct(){
        add_action('init', array(&$this, 'register_post_type'));
    }

    function register_post_type()
    {
        $labels = array(
            'name' => 'Filter',
            'singular_name' => 'Filter',
            'add_new' => 'Adicionar Novo',
            'add_new_item' => 'Adicionar Filters',
            'edit_item' => 'Editar',
            'new_item' => 'Novo Filter',
            'view_item' => 'Visualizar',
            'search_items' => 'Pesquisar',
            'not_found' => 'Nenhum ticket encontrado',
            'not_found_in_trash' => 'Nenhum Filter encontrado na lixeira',
            'parent_item_colon' => 'Filter acima:',
            'menu_name' => 'Filters'
        );
        $args = array(
            'labels' => $labels,
            'hierarchical' => true,
            //'supports' => array('title'),
            //'taxonomies' => array(self::TAXONOMY),
            'public' => true,
            'show_ui' => tnc_enable_dev_wp_interface(),
            'show_in_menu' => tnc_enable_dev_wp_interface(),
            //'menu_position' => 5,
            //'show_in_nav_menus' => false,
            'publicly_queryable' => true,
            'exclude_from_search' => true,
            'has_archive' => true,
            'query_var' => true,
            'can_export' => true,
            'rewrite' => true,
            'capability_type' => 'post',
        );
        register_post_type(self::POST_TYPE, $args);
    }
}