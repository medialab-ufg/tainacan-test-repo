const { registerBlockType } = wp.blocks;

const { __ } = wp.i18n;

const { RangeControl, TextControl, SelectControl, Button, ToggleControl, Placeholder, ColorPicker, ColorPalette, BaseControl, PanelBody } = wp.components;

const { InspectorControls, BlockControls } = ( tainacan_blocks.wp_version < '5.2' ? wp.editor : wp.blockEditor );

import TainacanBlocksCompatToolbar from '../../js/tainacan-blocks-compat-toolbar.js';
import SearchBarModal from './search-bar-modal.js';
import DeprecatedBlocks from './search-bar-deprecated.js';

registerBlockType('tainacan/search-bar', {
    title: __('Tainacan Search Bar', 'tainacan'),
    icon:
        <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-2 -2 20 20"
                height="24px"
                width="24px"
                class="tainacan-block-icon">
            <path 
                fill="#298596"
                d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>
        </svg>,
    category: 'tainacan-blocks',
    keywords: [ __( 'items', 'tainacan' ), __( 'search', 'tainacan' ), __( 'bar', 'tainacan' ) ],
    description: __('Set up a custom search bar to redirect to an item\'s list', 'tainacan'),
    example: {
        attributes: {
            collectionId: 'default',
            collectionSlug: 'preview'
        }
    },
    attributes: {
        content: {
            type: 'array',
            source: 'children',
            selector: 'div'
        },
        collectionId: {
            type: String,
            default: undefined
        },
        collectionSlug: {
            type: String,
            default: undefined
        },
        alignment: {
            type: String,
            default: 'center'
        },
        isModalOpen: {
            type: Boolean,
            default: false
        },
        maxWidth: {
            type: Number,
            value: 80
        },
        placeholderText: {
            type: String,
            default: __('Search', 'tainacan')
        },
        showCollectionHeader: {
            type: Boolean,
            value: false
        },
        showCollectionLabel: {
            type: Boolean,
            value: false
        },
        collectionHeaderHeight: {
            type: Number,
            value: 165
        },
        collectionBackgroundColor: {
            type: String,
            default: "#454647"
        },
        collectionTextColor: {
            type: String,
            default: "#ffffff"
        },
        collectionHeaderImage: {
            type: String,
            default: undefined
        },
        collectionName: {
            type: String,
            default: undefined
        },
        collectionTextSize: {
            type: Number,
            default: 2
        },
    },
    supports: {
        align: ['full', 'wide', 'left', 'center', 'right'],
        html: true,
        multiple: false,
        fontSize: true
    },
    styles: [
        {
            name: 'default',
            label: __('Default', 'tainacan'),
            isDefault: true,  
        },{
            name: 'alternate',
            label: __('alternate', 'tainacan'),
        },{
            name: 'stylish',
            label: __('stylish', 'tainacan'),
        }
    ],
    edit({ attributes, setAttributes, className, isSelected }){
        let {
            content, 
            collectionId,  
            collectionSlug,
            collectionHeaderHeight,
            collectionTextSize,
            alignment,
            placeholderText,
            isModalOpen,
            maxWidth,
            showCollectionHeader,
            showCollectionLabel,
            collectionBackgroundColor,
            collectionTextColor,
            collectionHeaderImage,
            collectionName
        } = attributes;        

        function setContent(){
 
            setAttributes({
                content: (
                    showCollectionHeader ?
                        <div>
                            { collectionHeaderImage ? 
                                <div
                                    className={ 'search-bar-collection-header-image' }
                                    style={{
                                        backgroundImage: 'url(' + collectionHeaderImage + ')',
                                        height: collectionHeaderHeight ? collectionHeaderHeight + 'px' : '160px'
                                    }}>
                                </div> : null 
                            } 
                            <div
                                className={ 
                                    (showCollectionHeader ? 'search-bar-collection-header-container' : '') + 
                                    (alignment == 'left' ? ' is-aligned-left' : '') + 
                                    (alignment == 'right' ? ' is-aligned-right' : '')
                                }
                                style={{
                                    backgroundColor: collectionBackgroundColor
                                }}>
                                <div 
                                    style={{ color: collectionTextColor ? collectionTextColor : '' }}
                                    class="search-bar-collection-header-title">
                                    { showCollectionLabel ? <span class="label">{ __('Collection', 'tainacan') }</span> : null }
                                    <h3 
                                        class="has-text-color"
                                        style={{ fontSize: collectionTextSize ? collectionTextSize + 'rem' : '2rem' }}>
                                        { collectionName ? collectionName : '' }
                                    </h3>
                                </div>
                                { collectionId && collectionSlug ?
                                    <div class="tainacan-search-container">
                                        <form
                                                style={{ maxWidth: maxWidth ? maxWidth + '%' : '80%' }}
                                                className={ 
                                                    (alignment == 'left' ? ' is-aligned-left' : '') + 
                                                    (alignment == 'right' ? ' is-aligned-right' : '') 
                                                }
                                                id="tainacan-search-bar-block"
                                                action={ tainacan_blocks.site_url + '/' + collectionSlug }
                                                method='get'>
                                            <input 
                                                style={{ borderColor: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}
                                                id="tainacan-search-bar-block_input"
                                                label={ __('Search', 'tainacan')}
                                                name='s'
                                                placeholder={ placeholderText }
                                            /> 
                                            <button 
                                                    class="button"
                                                    type="submit">  
                                                <span class="icon">
                                                    <i>
                                                        <svg
                                                            style={{ fill: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}    
                                                            width="24" 
                                                            height="24"
                                                            viewBox="-2 -2 20 20">
                                                        <path d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                                                            c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                                                            c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                                                            c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                                                            C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                                                            c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                                                            c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>       
                                                        </svg>
                                                    </i> 
                                                </span>
                                            </button>
                                        </form>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    : 
                        <div class="tainacan-search-container">
                            <form
                                    style={{ maxWidth: maxWidth ? maxWidth + '%' : '80%' }}
                                    className={ 
                                        (alignment == 'left' ? ' is-aligned-left' : '') + 
                                        (alignment == 'right' ? ' is-aligned-right' : '') 
                                    }
                                    id="tainacan-search-bar-block"
                                    action={ tainacan_blocks.site_url + '/' + collectionSlug }
                                    method='get'>
                                <input 
                                    style={{ borderColor: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}
                                    id="tainacan-search-bar-block_input"
                                    label={ __('Search', 'tainacan')}
                                    name='s'
                                    placeholder={ placeholderText }
                                /> 
                                <button 
                                        class="button"
                                        type="submit">  
                                    <span class="icon">
                                        <i>
                                            <svg
                                                style={{ fill: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}    
                                                width="24" 
                                                height="24"
                                                viewBox="-2 -2 20 20">
                                            <path d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                                                c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                                                c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                                                c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                                                C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                                                c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                                                c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>       
                                            </svg>
                                        </i> 
                                    </span>
                                </button>
                            </form>
                        </div>
                )
            }); 
        }

        function openSearchBarModal() {
            isModalOpen = true;
            setAttributes({ isModalOpen: isModalOpen });
        }

        function updateAlignment(newAlignment) {
            alignment = newAlignment;
            setAttributes({ alignment: alignment });
            setContent();
        }

        // function getCurrentStyle() {
        //     if (isSelected) {  
        //         if (className.split(' ').find((aClass) => aClass == 'is-style-alternate')) {
        //             return 'alternate'
        //         } else if (className.split(' ').find((aClass) => aClass == 'is-style-stylish')) {
        //             return 'stylish'
        //         }
        //     } 
        //     return 'default'
        // }
 

        // Executed only on the first load of page
        if (content && content.length && content[0].type)
            setContent();

        const alignmentControls = [
            {
                icon: 'editor-alignleft',
                title: __( 'Left' ),
                onClick: () => updateAlignment('left'),
                isActive: alignment === 'left',
            },            
            {
                icon: 'editor-aligncenter',
                title: __( 'Center' ),
                onClick: () => updateAlignment('center'),
                isActive: alignment === 'center',
            },
            {
                icon: 'editor-alignright',
                title: __( 'Right' ),
                onClick: () => updateAlignment('right'),
                isActive: alignment === 'right',
            },
        ]; 

        return content == 'preview' ? 
            <div className={className}>
                <img
                        width="100%"
                        src={ `${tainacan_blocks.base_url}/assets/images/search-bar.png` } />
            </div>
        : (
            <div className={className}>

                <div>
                    <BlockControls>
                        { TainacanBlocksCompatToolbar({ controls: alignmentControls }) }
                        { collectionId ?
                            TainacanBlocksCompatToolbar({
                                label:__('Configure search source', 'tainacan'),
                                icon: <svg width="24" height="24" viewBox="-2 -4 20 20">
                                        <path d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                                            c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                                            c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                                            c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                                            C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                                            c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                                            c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>       
                                    </svg>,
                                onClick: openSearchBarModal
                            })
                        : null }
                    </BlockControls> 
                </div>
 
                <div>
                    <InspectorControls>
                        <PanelBody
                                    title={__('Input settings', 'tainacan')}
                                    initialOpen={ true }
                                >
                            <div style={{ marginTop: '24px' }}>
                                <TextControl
                                    label={ __('Placeholder text', 'tainacan') }
                                    value={ placeholderText }
                                    onChange={ ( aPlaceholderText ) => {
                                        placeholderText = aPlaceholderText
                                        setAttributes( { placeholderText: placeholderText } );
                                        setContent(); 
                                    }}
                                />
                            </div>
                            <br />
                            <div style={{ marginBottom: '12px' }}>
                                <RangeControl
                                    label={__('Maximum width size (%)', 'tainacan')}
                                    value={ maxWidth ? maxWidth : 80 }
                                    onChange={ ( aMaxWidth ) => {
                                        maxWidth = aMaxWidth;
                                        setAttributes( { maxWidth: aMaxWidth } ) 
                                        setContent();
                                    }}
                                    min={ 15 }
                                    max={ 100 }
                                />
                            </div>
                        </PanelBody>
                        
                        <PanelBody
                                title={__('Collection header', 'tainacan')}
                                initialOpen={ false }
                            >
                                <ToggleControl
                                    label={__('Display header', 'tainacan')}
                                    help={ !showCollectionHeader ? __('Toggle to show collection header', 'tainacan') : __('Do not show collection header', 'tainacan')}
                                    checked={ showCollectionHeader }
                                    onChange={ ( isChecked ) => {
                                            showCollectionHeader = isChecked;
                                            setAttributes({ showCollectionHeader: showCollectionHeader });
                                            setContent();
                                        } 
                                    }
                                />
                                { showCollectionHeader ?
                                    <div style={{ margin: '5px' }}>
  
                                        { collectionHeaderImage ? 
                                            <RangeControl
                                                label={__('Header image height (px)', 'tainacan')}
                                                value={ collectionHeaderHeight ? collectionHeaderHeight : 125 }
                                                onChange={ ( aHeight ) => {
                                                    collectionHeaderHeight = aHeight;
                                                    setAttributes( { collectionHeaderHeight: collectionHeaderHeight } ) 
                                                    setContent();
                                                }}
                                                min={ 100 }
                                                max={ 300 } /> : null
                                        }

                                        <ToggleControl
                                            label={__('Display "Collection" label', 'tainacan')}
                                            help={ !showCollectionLabel ? __('Toggle to show "Collection" label above header', 'tainacan') : __('Do not show "Collection" label', 'tainacan')}
                                            checked={ showCollectionLabel }
                                            onChange={ ( isChecked ) => {
                                                    showCollectionLabel = isChecked;
                                                    setAttributes({ showCollectionLabel: showCollectionLabel });
                                                    setContent();
                                                } 
                                            }
                                        />

                                        <BaseControl
                                            id="colorpicker"
                                            label={ __('Background color', 'tainacan')}>
                                            <ColorPicker
                                                color={ collectionBackgroundColor }
                                                onChangeComplete={ ( value ) => {
                                                    collectionBackgroundColor = value.hex;
                                                    setAttributes({ collectionBackgroundColor: collectionBackgroundColor }) ;
                                                    setContent();
                                                }}
                                                disableAlpha
                                                />
                                        </BaseControl>

                                        <BaseControl
                                            id="colorpallete"
                                            label={ __('Collection name color', 'tainacan')}>
                                            <ColorPalette 
                                                colors={ [{ name: __('Black', 'tainacan'), color: '#000000'}, { name: __('White', 'tainacan'), color: '#ffffff'} ] } 
                                                value={ collectionTextColor }
                                                onChange={ ( color ) => {
                                                    collectionTextColor = color;
                                                    setAttributes({ collectionTextColor: collectionTextColor });
                                                    setContent(); 
                                                }} 
                                            />
                                        </BaseControl>

                                        <SelectControl
                                            label={__('Collection name size', 'tainacan')}
                                            value={ collectionTextSize ? collectionTextSize : 2 }
                                            options={ [
                                                { label: __('Large', 'tainacan'), value: 2.5 },
                                                { label: __('Medium', 'tainacan'), value: 2 },
                                                { label: __('Small', 'tainacan'), value: 1.5 },
                                            ] }
                                            onChange={ ( size ) => { 
                                                collectionTextSize = size;
                                                setAttributes({ collectionTextSize: collectionTextSize });
                                            }}
                                        />
                                    </div>
                                : null
                                }  
                        </PanelBody> 
                    </InspectorControls>
                </div>

                { isSelected ? 
                    (
                    <div>
                        { isModalOpen ? 
                            <SearchBarModal
                                existingCollectionId={ collectionId } 
                                existingCollectionSlug={ collectionSlug }
                                onSelectCollection={ (selectedCollection) => {
                                    collectionId = selectedCollection.id;
                                    collectionSlug = selectedCollection.slug;
                                    collectionName = selectedCollection.name;
                                    collectionHeaderImage = selectedCollection.header_image;
                                    collectionBackgroundColor = selectedCollection.tainacan_theme_collection_background_color ? selectedCollection.tainacan_theme_collection_background_color : '#454647'
                                    collectionTextColor = selectedCollection.tainacan_theme_collection_color ? selectedCollection.tainacan_theme_collection_color : '#ffffff';
                                    setAttributes({ 
                                        collectionId: collectionId, 
                                        collectionSlug: collectionSlug,
                                        collectionHeaderImage: collectionHeaderImage,
                                        collectionName: collectionName,
                                        collectionBackgroundColor: collectionBackgroundColor,
                                        collectionTextColor: collectionTextColor,
                                        isModalOpen: false
                                    });
                                    setContent();
                                }}
                                onCancelSelection={ () => setAttributes({ isModalOpen: false }) }/> 
                            : null
                        }
                    </div>
                    ) : null
                }

                { !collectionId ? (
                    <Placeholder
                        className="tainacan-block-placeholder"
                        icon={(
                            <img
                                width={148}
                                src={ `${tainacan_blocks.base_url}/assets/images/tainacan_logo_header.svg` }
                                alt="Tainacan Logo"/>
                        )}>
                        <p>
                            <span class="icon">
                                <i>
                                    <svg width="24" height="24" viewBox="-2 -2 20 20">
                                    <path d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                                        c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                                        c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                                        c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                                        C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                                        c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                                        c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>       
                                    </svg>
                                </i> 
                            </span>
                            {__('Set up a custom search bar to redirect to an item\'s list', 'tainacan')}
                        </p>
                        <Button
                            isPrimary
                            type="button"
                            onClick={ () => openSearchBarModal() }>
                            {__('Select search source', 'tainacan')}
                        </Button>   
                    </Placeholder>
                    ) : null
                }

                {
                    showCollectionHeader ?
                        <div>
                            { collectionHeaderImage ? 
                                <div
                                    className={ 'search-bar-collection-header-image' }
                                    style={{
                                        backgroundImage: 'url(' + collectionHeaderImage + ')',
                                        height: collectionHeaderHeight ? collectionHeaderHeight + 'px' : '160px'
                                    }}>
                                </div> : null 
                            } 
                            <div
                                className={ 
                                    (showCollectionHeader ? 'search-bar-collection-header-container' : '') + 
                                    (alignment == 'left' ? ' is-aligned-left' : '') + 
                                    (alignment == 'right' ? ' is-aligned-right' : '')
                                }
                                style={{
                                    backgroundColor: collectionBackgroundColor
                                }}>
                                <div 
                                    style={{ color: collectionTextColor ? collectionTextColor : '' }}
                                    class="search-bar-collection-header-title">
                                    { showCollectionLabel ? <span class="label">{ __('Collection', 'tainacan') }</span> : null }
                                    <h3 
                                        class="has-text-color"
                                        style={{ fontSize: collectionTextSize ? collectionTextSize + 'rem' : '2rem' }}>
                                        { collectionName ? collectionName : '' }
                                    </h3>
                                </div>
                                { collectionId && collectionSlug ?
                                    <div class="tainacan-search-container">
                                        <div
                                                style={{ maxWidth: maxWidth ? maxWidth + '%' : '80%' }}
                                                className={ 
                                                    (alignment == 'left' ? ' is-aligned-left' : '') + 
                                                    (alignment == 'right' ? ' is-aligned-right' : '') 
                                                }
                                                id="tainacan-search-bar-block">
                                            <input 
                                                style={{ borderColor: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}
                                                id="tainacan-search-bar-block_input"
                                                label={ __('Search', 'tainacan')}
                                                name='s'
                                                placeholder={ placeholderText }
                                            /> 
                                            <button 
                                                    class="button"
                                                    onClick={(event) => { event.preventDefault(); return false; }}>  
                                                <span class="icon">
                                                    <i>
                                                        <svg
                                                            style={{ fill: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}    
                                                            width="24" 
                                                            height="24"
                                                            viewBox="-2 -4 20 20">
                                                        <path d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                                                            c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                                                            c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                                                            c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                                                            C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                                                            c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                                                            c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>       
                                                        </svg>
                                                    </i> 
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    : null
                }
                
                { collectionId && collectionSlug && !showCollectionHeader ?
                        <div class="tainacan-search-container">
                            <div
                                    style={{ maxWidth: maxWidth ? maxWidth + '%' : '80%' }}
                                    className={ 
                                        (alignment == 'left' ? ' is-aligned-left' : '') + 
                                        (alignment == 'right' ? ' is-aligned-right' : '') 
                                    }
                                    id="tainacan-search-bar-block">
                                <input 
                                    style={{ borderColor: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}
                                    id="tainacan-search-bar-block_input"
                                    label={ __('Search', 'tainacan')}
                                    name='s'
                                    placeholder={ placeholderText }
                                /> 
                                <button 
                                        class="button">  
                                    <span class="icon">
                                        <i>
                                            <svg
                                                style={{ fill: showCollectionHeader && collectionBackgroundColor ? collectionBackgroundColor : '' }}    
                                                width="24" 
                                                height="24"
                                                viewBox="-2 -4 20 20">
                                            <path d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                                                c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                                                c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                                                c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                                                C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                                                c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                                                c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>       
                                            </svg>
                                        </i> 
                                    </span>
                                </button>
                            </div>
                        </div>
                    : null
                }
            </div>
        );
    },
    save({ attributes, className }){
        const { content } = attributes;
        return <div className={ className }>{ content }</div>
    },
    deprecated: DeprecatedBlocks
});