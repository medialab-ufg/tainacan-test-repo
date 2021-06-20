const { registerBlockType } = wp.blocks;

const { __ } = wp.i18n;

const { RangeControl, IconButton, Button, ToggleControl, Placeholder, PanelBody } = wp.components;

const { InspectorControls, BlockControls } = ( tainacan_blocks.wp_version < '5.2' ? wp.editor : wp.blockEditor );

import TainacanBlocksCompatToolbar from '../../js/tainacan-blocks-compat-toolbar.js';
import ItemsModal from './items-modal.js';
import DeprecatedBlocks from './items-list-deprecated.js';

registerBlockType('tainacan/items-list', {
    title: __('Tainacan Items List', 'tainacan'),
    icon:
        <svg
                width="24"
                height="24"
                viewBox="0 -2 12 16"
                class="tainacan-block-icon">
            <path
                fill="#298596"                
                d="M8.8,1.2H1.2V10H0V1.2C0,0.6,0.6,0,1.2,0h7.5V1.2z M3.8,2.5c-0.7,0-1.2,0.6-1.2,1.3v8.8c0,0.7,0.6,1.2,1.2,1.2h6.9
                c0.7,0,1.2-0.6,1.2-1.2V6.3L8.1,2.5H3.8z M7.5,3.4L11,6.9H7.5V3.4z"/>       
        </svg>,
    category: 'tainacan-blocks',
    keywords: [ __( 'Tainacan', 'tainacan' ), __( 'items', 'tainacan' ), __( 'collection', 'tainacan' ) ],
    description: __('Expose items from your Tainacan collections', 'tainacan'),
    example: {
        attributes: {
            content: 'preview'
        }
    },
    attributes: {
        selectedItemsObject: {
            type: 'array',
            source: 'query',
            selector: 'a',
            query: {
                id: {
                    type: 'string',
                    source: 'attribute',
                    attribute: 'id'
                },
                url: {
                    type: 'string',
                    source: 'attribute',
                    attribute: 'href'
                },
                title: {
                    type: 'string',
                    source: 'text'
                },
                thumbnail: {
                    source: 'query',
                    selector: 'img',
                    query: {
                        src: {
                            source: 'attribute',
                            attribute: 'src'
                        },
                        alt: {
                            source: 'attribute',
                            attribute: 'alt'
                        },
                    }
                }, 
            },
            default: []
        },
        content: {
            type: 'array',
            source: 'children',
            selector: 'div'
        },
        query: {
            type: Object,
            default: {}
        },
        collectionId: {
            type: String,
            default: undefined
        },
        selectedItemsHTML: {
            type: Array,
            default: []
        },
        showImage: {
            type: Boolean,
            default: true
        },
        showName: {
            type: Boolean,
            default: true
        },
        layout: {
            type: String,
            default: 'grid'
        },
        isModalOpen: {
            type: Boolean,
            default: false
        },
        gridMargin: {
            type: Number,
            default: 0
        }
    },
    supports: {
        align: ['full', 'wide'],
        html: false,
        fontSize: true
    },
    edit({ attributes, setAttributes, className, isSelected }){
        let {
            selectedItemsObject, 
            selectedItemsHTML, 
            content, 
            collectionId,  
            showImage,
            showName,
            layout,
            isModalOpen,
            gridMargin
        } = attributes;

        function prepareItem(item) {
            return (
                <li 
                    key={ item.id }
                    className="item-list-item"
                    style={{ marginBottom: layout == 'grid' ?  (showName ? gridMargin + 12 : gridMargin) + 'px' : ''}}>
                    { tainacan_blocks.wp_version < '5.4' ?
                        <IconButton
                            onClick={ () => removeItemOfId(item.id) }
                            icon="no-alt"
                            label={__('Remove', 'tainacan')}/>
                            :
                        <Button
                            onClick={ () => removeItemOfId(item.id) }
                            icon="no-alt"
                            showTooltip={false}
                            label={__('Remove', 'tainacan')}/>
                    }
                    <a 
                        id={ isNaN(item.id) ? item.id : 'item-id-' + item.id }
                        href={ item.url } 
                        target="_blank"
                        className={ (!showName ? 'item-without-title' : '') + ' ' + (!showImage ? 'item-without-image' : '') }>
                        <img
                            src={ item.thumbnail && item.thumbnail[0] && item.thumbnail[0].src ? item.thumbnail[0].src : `${tainacan_blocks.base_url}/assets/images/placeholder_square.png`}
                            alt={ item.thumbnail && item.thumbnail[0] ? item.thumbnail[0].alt : item.title }/>
                        <span>{ item.title ? item.title : '' }</span>
                    </a>
                </li>
            );
        }

        function setContent(){

            selectedItemsHTML = [];

            for (let i = 0; i < selectedItemsObject.length; i++)
                selectedItemsHTML.push(prepareItem(selectedItemsObject[i]));

            setAttributes({
                content: (
                    <ul 
                        style={{ gridTemplateColumns: layout == 'grid' ? 'repeat(auto-fill, ' +  (gridMargin + (showName ? 220 : 185)) + 'px)' : 'inherit' }}
                        className={'items-list  items-layout-' + layout + (!showName ? ' items-list-without-margin' : '')}>
                        { selectedItemsHTML }
                    </ul>
                ),
                selectedItemsHTML: selectedItemsHTML
            });
        }

        function openItemsModal() {
            isModalOpen = true;
            setAttributes( { 
                isModalOpen: isModalOpen
            } );
        }

        function removeItemOfId(itemId) {

            let existingItemIndex = selectedItemsObject.findIndex((existingItem) => ((existingItem.id == 'item-id-' + itemId) || (existingItem.id == itemId)));

            if (existingItemIndex >= 0)
                selectedItemsObject.splice(existingItemIndex, 1);

            setContent();
        }

        function updateLayout(newLayout) {
            layout = newLayout;

            if (layout == 'grid' && showImage == false)
                showImage = true;

            if (layout == 'list' && showName == false)
                showName = true;

            setAttributes({ 
                layout: layout, 
                showImage: showImage,
                showName: showName
            });
            setContent();
        }

        // Executed only on the first load of page
        if(content && content.length && content[0].type)
            setContent();

        const layoutControls = [
            {
                icon: 'grid-view',
                title: __( 'Grid View', 'tainacan' ),
                onClick: () => updateLayout('grid'),
                isActive: layout === 'grid',
            },
            {
                icon: 'list-view',
                title: __( 'List View', 'tainacan' ),
                onClick: () => updateLayout('list'),
                isActive: layout === 'list',
            }
        ];

        return content == 'preview' ? 
                <div className={className}>
                    <img
                            width="100%"
                            src={ `${tainacan_blocks.base_url}/assets/images/items-list.png` } />
                </div>
            :  (
            <div className={className}>

                <div>
                    <BlockControls>
                        { TainacanBlocksCompatToolbar({ controls: layoutControls }) }
                        { selectedItemsHTML.length ?
                            TainacanBlocksCompatToolbar({
                                label: __( 'Add more items', 'tainacan' ),
                                icon: <svg width="24" height="24" viewBox="0 -2 12 16">
                                        <path
                                            d="M8.8,1.2H1.2V10H0V1.2C0,0.6,0.6,0,1.2,0h7.5V1.2z M3.8,2.5c-0.7,0-1.2,0.6-1.2,1.3v8.8c0,0.7,0.6,1.2,1.2,1.2h6.9
                                            c0.7,0,1.2-0.6,1.2-1.2V6.3L8.1,2.5H3.8z M7.5,3.4L11,6.9H7.5V3.4z"/>       
                                    </svg>,
                                onClick: openItemsModal
                            })
                        : null }
                    </BlockControls>
                </div>

                <div>
                    <InspectorControls>
                        <PanelBody
                                title={ __('List settings', 'tainacan') }
                                initialOpen={ true }
                            >
                            { layout == 'list' ? 
                                <ToggleControl
                                    label={__('Image', 'tainacan')}
                                    help={ showImage ? __('Toggle to show item\'s image', 'tainacan') : __('Do not show item\'s image', 'tainacan')}
                                    checked={ showImage }
                                    onChange={ ( isChecked ) => {
                                            showImage = isChecked;
                                            setAttributes({ showImage: showImage });
                                            setContent();
                                        } 
                                    }
                                /> 
                            : null }
                            { layout == 'grid' ?
                                <div>
                                    <ToggleControl
                                        label={__('Name', 'tainacan')}
                                        help={ showName ? __('Toggle to show item\'s title', 'tainacan') : __('Do not show item\'s title', 'tainacan')}
                                        checked={ showName }
                                        onChange={ ( isChecked ) => {
                                                showName = isChecked;
                                                setAttributes({ showName: showName });
                                                setContent();
                                            } 
                                        }
                                    />
                                    <div style={{ marginTop: '16px'}}>
                                        <RangeControl
                                            label={__('Margin between items', 'tainacan')}
                                            value={ gridMargin }
                                            onChange={ ( margin ) => {
                                                setAttributes( { gridMargin: margin } ) 
                                                setContent();
                                            }}
                                            min={ 0 }
                                            max={ 48 }
                                        />
                                    </div>
                                </div>
                            : null }
                        </PanelBody>
                    </InspectorControls>
                </div>

                { isSelected ? 
                    (
                    <div>
                        { isModalOpen ? 
                            <ItemsModal
                                existingCollectionId={ collectionId } 
                                onSelectCollection={ (selectedCollectionId) => {
                                    collectionId = selectedCollectionId;
                                    setAttributes({ collectionId: collectionId });
                                }}
                                onApplySelection={ (aSelectedItemsObject) =>{
                                    selectedItemsObject = selectedItemsObject.concat(aSelectedItemsObject);
                                    setAttributes({
                                        selectedItemsObject: selectedItemsObject,
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

                { !selectedItemsHTML.length ? (
                    <Placeholder
                        className="tainacan-block-placeholder"
                        icon={(
                            <img
                                width={148}
                                src={ `${tainacan_blocks.base_url}/assets/images/tainacan_logo_header.svg` }
                                alt="Tainacan Logo"/>
                        )}>
                        <p>
                            <svg width="24" height="24" viewBox="0 -2 12 16">
                                <path
                                    d="M8.8,1.2H1.2V10H0V1.2C0,0.6,0.6,0,1.2,0h7.5V1.2z M3.8,2.5c-0.7,0-1.2,0.6-1.2,1.3v8.8c0,0.7,0.6,1.2,1.2,1.2h6.9
                                    c0.7,0,1.2-0.6,1.2-1.2V6.3L8.1,2.5H3.8z M7.5,3.4L11,6.9H7.5V3.4z"/>       
                            </svg>
                            {__('Expose items from your Tainacan collections', 'tainacan')}
                        </p>
                        <Button
                            isPrimary
                            type="button"
                            onClick={ () => openItemsModal() }>
                            {__('Select items', 'tainacan')}
                        </Button>   
                    </Placeholder>
                    ) : null
                }

                <ul 
                    style={{ gridTemplateColumns: layout == 'grid' ? 'repeat(auto-fill, ' +  (gridMargin + (showName ? 220 : 185)) + 'px)' : 'inherit' }}
                    className={'items-list-edit items-layout-' + layout + (!showName ? ' items-list-without-margin' : '')}>
                    { selectedItemsHTML }
                </ul>
                
            </div>
        );
    },
    save({ attributes, className }){
        const { content } = attributes;
        return <div className={className}>{ content }</div>
    },
    deprecated: DeprecatedBlocks
});