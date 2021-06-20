const { registerBlockType } = wp.blocks;

const { __ } = wp.i18n;

const { ResizableBox, FocalPointPicker, SelectControl, RangeControl, Spinner, Button, ToggleControl, Tooltip, Placeholder, ColorPicker, ColorPalette, BaseControl, PanelBody } = wp.components;

const { InspectorControls, BlockControls } = ( tainacan_blocks.wp_version < '5.2' ? wp.editor : wp.blockEditor );

import DynamicItemsModal from './dynamic-items-modal.js';
import tainacan from '../../js/axios.js';
import axios from 'axios';
import qs from 'qs';
import { ThumbnailHelperFunctions } from '../../../admin/js/utilities.js';
import TainacanBlocksCompatToolbar from '../../js/tainacan-blocks-compat-toolbar.js';
import DeprecatedBlocks from './dynamic-items-list-deprecated.js';

registerBlockType('tainacan/dynamic-items-list', {
    title: __('Tainacan Collection\'s Items List', 'tainacan'),
    icon:
        <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
                class="tainacan-block-icon">
            <path
                fill="#298596"
                d="M14,2V4H7v7.24A5.33,5.33,0,0,0,5.5,11a4.07,4.07,0,0,0-.5,0V4A2,2,0,0,1,7,2Zm7,10v8a2,2,0,0,1-2,2H12l1-1-2.41-2.41A5.56,5.56,0,0,0,11,16.53a5.48,5.48,0,0,0-2-4.24V8a2,2,0,0,1,2-2h4Zm-2.52,0L14,7.5V12ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1-.5-7,2.74,2.74,0,0,1,.5,0,3.41,3.41,0,0,1,1.5.34,3.5,3.5,0,0,1,2,3.16,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,0,0,5.5,15a1.39,1.39,0,0,0-.5.09A1.5,1.5,0,0,0,5.5,18a1.48,1.48,0,0,0,1.42-1A1.5,1.5,0,0,0,7,16.53Z"/>
        </svg>,
    category: 'tainacan-blocks',
    keywords: [ __( 'items', 'tainacan' ), __( 'search', 'tainacan' ), __( 'collection', 'tainacan' ) ],
    description: __('Dynamically list items from a Tainacan items search', 'tainacan'),
    example: {
        attributes: {
            content: 'preview'
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
        items: {
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
        },
        searchURL: {
            type: String,
            default: undefined
        },
        itemsRequestSource: {
            type: String,
            default: undefined
        },
        maxItemsNumber: {
            type: Number,
            value: undefined
        },
        isLoading: {
            type: Boolean,
            value: false
        },
        isLoadingCollection: {
            type: Boolean,
            value: false
        },
        showSearchBar: {
            type: Boolean,
            value: false
        },
        showCollectionHeader: {
            type: Boolean,
            value: false
        },
        showCollectionLabel: {
            type: Boolean,
            value: false
        },
        collection: {
            type: Object,
            value: undefined
        },
        searchString: {
            type: String,
            default: undefined
        },
        order: {
            type: String,
            default: undefined
        },
        blockId: {
            type: String,
            default: undefined
        },
        collectionBackgroundColor: {
            type: String,
            default: "#454647"
        },
        collectionTextColor: {
            type: String,
            default: "#ffffff"
        },
        mosaicHeight: {
            type: Number,
            value: 280
        },
        mosaicGridColumns: {
            type: Number,
            value: 3
        },
        mosaicGridRows: {
            type: Number,
            value: 3
        },
        sampleBackgroundImage: {
            type: String,
            default: ''
        },
        mosaicItemFocalPoint: {
            type: Object,
            default: {
                x: 0.5,
                y: 0.5
            }
        },
        mosaicDensity: {
            type: Number,
            default: 5
        },
        maxColumnsCount: {
            type: Number,
            default: 4
        },
        cropImagesToSquare: {
            type: Boolean,
            value: true
        }
    },
    supports: {
        align: ['full', 'wide'],
        html: false,
        fontSize: true
    },
    edit({ attributes, setAttributes, className, isSelected, clientId }){
        let {
            items, 
            content, 
            collection,
            collectionId,  
            showImage,
            showName,
            layout,
            isModalOpen,
            gridMargin,
            searchURL,
            itemsRequestSource,
            maxItemsNumber,
            order,
            searchString,
            isLoading,
            showSearchBar,
            showCollectionHeader,
            showCollectionLabel,
            isLoadingCollection,
            collectionBackgroundColor,
            collectionTextColor,
            mosaicHeight,
            mosaicGridColumns,
            mosaicGridRows,
            mosaicItemFocalPoint,
            sampleBackgroundImage,
            mosaicDensity,
            maxColumnsCount,
            cropImagesToSquare
        } = attributes;

        // Obtains block's client id to render it on save function
        setAttributes({ blockId: clientId });
        
        // Sets some defaults that were not working
        if (maxColumnsCount === undefined) {
            maxColumnsCount = 5;
            setAttributes({ maxColumnsCount: maxColumnsCount });
        }
        if (cropImagesToSquare === undefined) {  
            cropImagesToSquare = true;    
            setAttributes({ cropImagesToSquare: cropImagesToSquare });
        }
                
        const thumbHelper = ThumbnailHelperFunctions();
        
        function prepareItem(item) {
            return (
                <li 
                    key={ item.id }
                    className="item-list-item"
                    style={ {
                        backgroundImage: layout == 'mosaic' ? `url(${ thumbHelper.getSrc(item['thumbnail'], 'medium_large', item['document_mimetype']) })` : 'none',
                        backgroundPosition: layout == 'mosaic' ? `${ (mosaicItemFocalPoint && mosaicItemFocalPoint.x ? mosaicItemFocalPoint.x : 0.5) * 100 }% ${ (mosaicItemFocalPoint && mosaicItemFocalPoint.y ? mosaicItemFocalPoint.y : 0.5) * 100 }%` : 'none'
                    }}
                >      
                    <a 
                        id={ isNaN(item.id) ? item.id : 'item-id-' + item.id }
                        href={ item.url } 
                        onClick={ (event) => event.preventDefault() }
                        target="_blank"
                        style={ {
                            
                        } }
                        className={ (!showName ? 'item-without-title' : '') + ' ' + (!showImage ? 'item-without-image' : '') }>
                        <img
                            src={ thumbHelper.getSrc(item['thumbnail'], ( (layout == 'list' || cropImagesToSquare) ? 'tainacan-medium' : 'tainacan-medium-full'), item['document_mimetype']) }
                            srcSet={ thumbHelper.getSrcSet(item['thumbnail'], ( (layout == 'list' || cropImagesToSquare) ? 'tainacan-medium' : 'tainacan-medium-full'), item['document_mimetype']) }
                            alt={ item.thumbnail_alt ? item.thumbnail_alt : (item && item.title ? item.title : __( 'Thumbnail', 'tainacan' )) }/>
                        <span>{ item.title ? item.title : '' }</span>
                    </a>
                </li>
            );
        }

        function prepareMosaicItem(mosaicGroup, mosaicGroupsLength) {
            
            return (
                <div 
                    style={
                        { 
                            width: 'calc((100% / ' + mosaicGroupsLength + ') - ' + gridMargin + 'px)',
                            height: 'calc(((' + (mosaicGridRows - 1) + ' * ' + gridMargin + 'px) + ' + mosaicHeight + 'px))',
                            gridTemplateColumns: 'repeat(' + mosaicGridColumns + ', calc((100% / ' + mosaicGridColumns + ') - (' + ((mosaicGridColumns - 1)*Number(gridMargin)) + 'px/' + mosaicGridColumns + ')))',
                            margin: gridMargin + 'px',
                            gridGap: gridMargin + 'px',
                        }
                    }
                    className={ 'mosaic-container mosaic-container--' + mosaicGroup.length + '-' + mosaicGridRows + 'x' + mosaicGridColumns }>
                        { buildMosaic(mosaicGroup) }
                    </div>
            )
        }

        function setContent(){

            if (searchURL) {

                items = [];
                isLoading = true;
                
                if (itemsRequestSource != undefined && typeof itemsRequestSource == 'function')
                    itemsRequestSource.cancel('Previous items search canceled.');

                itemsRequestSource = axios.CancelToken.source();
                
                setAttributes({
                    isLoading: isLoading
                });

                let endpoint = '/collection' + searchURL.split('#')[1].split('/collections')[1];
                let query = endpoint.split('?')[1];
                let queryObject = qs.parse(query);

                // Set up max items to be shown
                if (maxItemsNumber != undefined && maxItemsNumber > 0)
                    queryObject.perpage = maxItemsNumber;
                else if (queryObject.perpage != undefined && queryObject.perpage > 0)
                    setAttributes({ maxItemsNumber: queryObject.perpage });
                else {
                    queryObject.perpage = 12;
                    setAttributes({ maxItemsNumber: 12 });
                }

                // Set up sorting order
                if (order != undefined)
                    queryObject.order = order;
                else if (queryObject.order != undefined)
                    setAttributes({ order: queryObject.order });
                else {
                    queryObject.order = 'asc';
                    setAttributes({ order: 'asc' });
                }

                // Set up sorting order
                if (searchString != undefined)
                    queryObject.search = searchString;
                else if (queryObject.search != undefined)
                    setAttributes({ searchString: queryObject.search });
                else {
                    delete queryObject.search;
                    setAttributes({ searchString: undefined });
                }

                // Remove unecessary queries
                delete queryObject.readmode;
                delete queryObject.iframemode;
                delete queryObject.admin_view_mode;
                delete queryObject.fetch_only_meta;
                
                endpoint = endpoint.split('?')[0] + '?' + qs.stringify(queryObject) + '&fetch_only=title,url,thumbnail';
                
                tainacan.get(endpoint, { cancelToken: itemsRequestSource.token })
                    .then(response => {
                        
                        if (layout !== 'mosaic') {
                           
                            for (let item of response.data.items)
                                items.push(prepareItem(item));

                            setAttributes({
                                content: <div></div>,
                                items: items,
                                isLoading: false,
                                itemsRequestSource: itemsRequestSource
                            });

                        } else {
                            // Initializes some variables
                            mosaicDensity = mosaicDensity ? mosaicDensity : 5;
                            mosaicGridRows = mosaicGridRows ? mosaicGridRows : 3;
                            mosaicGridColumns = mosaicGridColumns ? mosaicGridColumns : 3;
                            mosaicHeight = mosaicHeight ? mosaicHeight : 280;
                            mosaicItemFocalPoint = mosaicItemFocalPoint ? mosaicItemFocalPoint : { x: 0.5, y: 0.5 };
                            sampleBackgroundImage = response.data.items && response.data.items[0] && response.data.items[0] ? getItemThumbnail(response.data.items[0], 'tainacan-medium') : ''; 
 
                            const mosaicGroups = mosaicPartition(response.data.items);
                            for (let mosaicGroup of mosaicGroups)
                                items.push(prepareMosaicItem(mosaicGroup, mosaicGroups.length));

                            setAttributes({
                                content: <div></div>,
                                items: items,
                                isLoading: false,
                                itemsRequestSource: itemsRequestSource,
                                mosaicDensity: mosaicDensity,
                                mosaicHeight: mosaicHeight,
                                mosaicGridRows: mosaicGridRows,
                                mosaicGridColumns: mosaicGridColumns,
                                mosaicItemFocalPoint: mosaicItemFocalPoint,
                                sampleBackgroundImage: sampleBackgroundImage
                            });
                        }
                    });
            }
        }

        function fetchCollectionForHeader() {
            if (showCollectionHeader) {

                isLoadingCollection = true;             
                setAttributes({
                    isLoadingCollection: isLoadingCollection
                });

                tainacan.get('/collections/' + collectionId + '?fetch_only=name,thumbnail,header_image')
                    .then(response => {
                        collection = response.data;
                        isLoadingCollection = false;      

                        if (collection.tainacan_theme_collection_background_color)
                            collectionBackgroundColor = collection.tainacan_theme_collection_background_color;
                        else
                            collectionBackgroundColor = '#454647';

                        if (collection.tainacan_theme_collection_color)
                            collectionTextColor = collection.tainacan_theme_collection_color;
                        else
                            collectionTextColor = '#ffffff';

                        setAttributes({
                            content: <div></div>,
                            collection: collection,
                            isLoadingCollection: isLoadingCollection,
                            collectionBackgroundColor: collectionBackgroundColor,
                            collectionTextColor: collectionTextColor
                        });
                    });
            }
        }

        function getItemThumbnail(item, size) {
            return (
                item.thumbnail && item.thumbnail[size][0] && item.thumbnail[size][0] 
                ?
                item.thumbnail[size][0] 
                    :
                (item.thumbnail && item.thumbnail['thumbnail'][0] && item.thumbnail['thumbnail'][0]
                    ?    
                item.thumbnail['thumbnail'][0] 
                    : 
                `${tainacan_blocks.base_url}/assets/images/placeholder_square.png`)
            )
        }

        function openDynamicItemsModal() {
            isModalOpen = true;
            setAttributes( { 
                isModalOpen: isModalOpen
            } );
        }

        function updateLayout(newLayout) {
            layout = newLayout;

            if ((layout == 'grid' || layout == 'mosaic') && showImage == false)
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

        function applySearchString(event) {

            let value = event.target.value;

            if (searchString != value) {
                searchString = value;
                setAttributes({ searchString: searchString });
                setContent();
            }
        }

        function updateMosaicItemFocalPoint(focalPoint) {
            if (Math.abs(focalPoint.x - (mosaicItemFocalPoint && mosaicItemFocalPoint.x ? mosaicItemFocalPoint.x : 0.5)) > 0.025 || Math.abs(focalPoint.y - (mosaicItemFocalPoint && mosaicItemFocalPoint.y ? mosaicItemFocalPoint.y : 0.5)) > 0.025) {
                mosaicItemFocalPoint = focalPoint;
                setAttributes({ mosaicItemFocalPoint: focalPoint });
                setContent();
            }
        }

        function mosaicPartition(items) {
            const partition = _.groupBy(items, (item, i) => {
                if (i % 2 == 0)
                    return Math.floor(i/mosaicDensity)
                else
                    return Math.floor(i/(mosaicDensity + 1))
            });
            return _.values(partition);
        }

        function buildMosaic(mosaicGroup) {
            let mosaic = []
            for (let item of mosaicGroup) 
                mosaic.push(prepareItem(item))
            return mosaic;
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
            },
            {
                icon: 'layout',
                title: __( 'Mosaic View', 'tainacan' ),
                onClick: () => updateLayout('mosaic'),
                isActive: layout === 'mosaic',
            }
        ];

        return content == 'preview' ? 
                <div className={className}>
                    <img
                            width="100%"
                            src={ `${tainacan_blocks.base_url}/assets/images/dynamic-items-list.png` } />
                </div>
            : (
            <div className={className}>

                <div>
                    <BlockControls>
                        { TainacanBlocksCompatToolbar({ controls: layoutControls }) }
                        { items.length ? 
                            TainacanBlocksCompatToolbar({
                                label: __('Configure search', 'tainacan'),
                                icon: <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 -2 24 24"
                                            height="24px"
                                            width="24px">
                                        <path d="M14,2V4H7v7.24A5.33,5.33,0,0,0,5.5,11a4.07,4.07,0,0,0-.5,0V4A2,2,0,0,1,7,2Zm7,10v8a2,2,0,0,1-2,2H12l1-1-2.41-2.41A5.56,5.56,0,0,0,11,16.53a5.48,5.48,0,0,0-2-4.24V8a2,2,0,0,1,2-2h4Zm-2.52,0L14,7.5V12ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1-.5-7,2.74,2.74,0,0,1,.5,0,3.41,3.41,0,0,1,1.5.34,3.5,3.5,0,0,1,2,3.16,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,0,0,5.5,15a1.39,1.39,0,0,0-.5.09A1.5,1.5,0,0,0,5.5,18a1.48,1.48,0,0,0,1.42-1A1.5,1.5,0,0,0,7,16.53Z"/>
                                    </svg>,
                                onClick: openDynamicItemsModal
                            })
                        : null }
                    </BlockControls>
                </div>

                <div>
                    <InspectorControls>
                        
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
                                            if (isChecked) fetchCollectionForHeader();
                                            setAttributes({ showCollectionHeader: showCollectionHeader });
                                        } 
                                    }
                                />
                                { showCollectionHeader ?
                                    <div style={{ margin: '6px' }}>

                                        <ToggleControl
                                            label={__('Display "Collection" label', 'tainacan')}
                                            help={ !showCollectionLabel ? __('Toggle to show "Collection" label above header', 'tainacan') : __('Do not show "Collection" label', 'tainacan')}
                                            checked={ showCollectionLabel }
                                            onChange={ ( isChecked ) => {
                                                    showCollectionLabel = isChecked;
                                                    setAttributes({ showCollectionLabel: showCollectionLabel });
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
                                                    setAttributes({ collectionBackgroundColor: collectionBackgroundColor }) 
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
                                                    setAttributes({ collectionTextColor: collectionTextColor }) 
                                                }} 
                                            />
                                        </BaseControl>
                                    </div>
                                : null
                                }
                        </PanelBody> 
                        <PanelBody
                                title={__('Search bar', 'tainacan')}
                                initialOpen={ true }
                            >
                            <ToggleControl
                                label={__('Display bar', 'tainacan')}
                                help={ showSearchBar ? __('Toggle to show search bar on block', 'tainacan') : __('Do not show search bar', 'tainacan')}
                                checked={ showSearchBar }
                                onChange={ ( isChecked ) => {
                                        showSearchBar = isChecked;
                                        setAttributes({ showSearchBar: showSearchBar });
                                    } 
                                }
                            />
                        </PanelBody>
                        <PanelBody
                                title={__('Items', 'tainacan')}
                                initialOpen={ true }
                            >
                            <div>
                                <RangeControl
                                    label={__('Maximum number of items', 'tainacan')}
                                    value={ maxItemsNumber ? maxItemsNumber : 12 }
                                    onChange={ ( aMaxItemsNumber ) => {
                                        maxItemsNumber = aMaxItemsNumber;
                                        setAttributes( { maxItemsNumber: aMaxItemsNumber } ) 
                                        setContent();
                                    }}
                                    min={ 1 }
                                    max={ 96 }
                                />
                            </div>
                            <hr></hr>
                            <div>
                                { layout == 'list' ? 
                                    <div style={{ marginTop: '16px'}}>
                                        <RangeControl
                                            label={ __('Maximum number of columns on a wide screen', 'tainacan') }
                                            value={ maxColumnsCount ? maxColumnsCount : 5 }
                                            onChange={ ( aMaxColumnsCount ) => {
                                                maxColumnsCount = aMaxColumnsCount;
                                                setAttributes( { maxColumnsCount: aMaxColumnsCount } );
                                                setContent(); 
                                            }}
                                            min={ 1 }
                                            max={ 7 }
                                        />
                                        <ToggleControl
                                            label={__('Image', 'tainacan')}
                                            help={ showImage ? __("Toggle to show item's image", 'tainacan') : __("Do not show item's image", 'tainacan')}
                                            checked={ showImage }
                                            onChange={ ( isChecked ) => {
                                                    showImage = isChecked;
                                                    setAttributes({ showImage: showImage });
                                                    setContent();
                                                } 
                                            }
                                        />
                                    </div>
                                : null }
                                { layout == 'grid' || layout == 'mosaic' ?
                                    <div>
                                        <ToggleControl
                                            label={__("Item's title", 'tainacan')}
                                            help={ showName ? __("Toggle to show item's title", 'tainacan') : __("Do not show item's title", 'tainacan')}
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
                                                label={__('Margin between items in pixels', 'tainacan')}
                                                value={ gridMargin ? gridMargin : 0 }
                                                onChange={ ( margin ) => {
                                                    gridMargin = margin;
                                                    setAttributes( { gridMargin: margin } );
                                                    setContent();
                                                }}
                                                min={ 0 }
                                                max={ 48 }
                                            />
                                        </div>
                                    </div>
                                : null }
                                { layout == 'grid' ?
                                    <div style={{ marginTop: '16px'}}>
                                        <RangeControl
                                                label={ __('Maximum number of columns on a wide screen', 'tainacan') }
                                                value={ maxColumnsCount ? maxColumnsCount : 5 }
                                                onChange={ ( aMaxColumnsCount ) => {
                                                    maxColumnsCount = aMaxColumnsCount;
                                                    setAttributes( { maxColumnsCount: aMaxColumnsCount } );
                                                    setContent(); 
                                                }}
                                                min={ 1 }
                                                max={ 7 }
                                            />
                                        <ToggleControl
                                                label={__('Crop Images', 'tainacan')}
                                                help={ cropImagesToSquare ? __('Do not use square cropeed version of the item thumbnail.', 'tainacan') : __('Toggle to use square cropped version of the item thumbnail.', 'tainacan') }
                                                checked={ cropImagesToSquare }
                                                onChange={ ( isChecked ) => {
                                                        cropImagesToSquare = isChecked;
                                                        setAttributes({ cropImagesToSquare: cropImagesToSquare });
                                                        setContent();
                                                    } 
                                                }
                                            />
                                    </div>
                                : null }
                            </div>
                        </PanelBody>
                        { layout == 'mosaic' ?
                        <PanelBody
                            title={__('Mosaic', 'tainacan')}
                            initialOpen={ true }
                            >
                            <div>
                                <RangeControl
                                    label={__('Container height (px)', 'tainacan')}
                                    value={ mosaicHeight ? mosaicHeight : 280 }
                                    onChange={ ( height ) => {
                                        mosaicHeight = height;
                                        setAttributes( { mosaicHeight: height } );
                                        setContent();
                                    }}
                                    min={ 100 }
                                    max={ 2000 }
                                />
                            </div>
                            <div>
                                <RangeControl
                                    label={__('Group Grid Density', 'tainacan')}
                                    value={ mosaicDensity ? mosaicDensity : 5 }
                                    onChange={ ( value ) => {
                                        mosaicDensity = value;
                                        setAttributes( { mosaicDensity: mosaicDensity } );
                                        setContent();
                                    }}
                                    min={ 1 }
                                    max={ 5 }
                                />
                            </div>
                            <div>
                                <SelectControl
                                    label={__('Group Grid Dimensions', 'tainacan')}
                                    value={ mosaicGridRows + 'x' + mosaicGridColumns }
                                    options={ [
                                        { label: '2 x 3', value: '2x3' },
                                        { label: '3 x 2', value: '3x2' },
                                        { label: '3 x 3', value: '3x3' },
                                        { label: '3 x 4', value: '3x4' },
                                        { label: '4 x 3', value: '4x3' },
                                        { label: '4 x 5', value: '4x5' },
                                        { label: '5 x 4', value: '5x4' },
                                    ] }
                                    onChange={ ( aGrid ) => { 
                                        mosaicGridRows = aGrid.split('x')[0];
                                        mosaicGridColumns = aGrid.split('x')[1];
                    
                                        setAttributes({
                                            mosaicGridRows: mosaicGridRows,
                                            mosaicGridColumns: mosaicGridColumns
                                        }); 
                                        setContent();
                                    }}/>
                            </div>
                            <div>
                                <FocalPointPicker 
                                    label={ __('Item focal point for background image', 'tainacan') }
                                    url={ sampleBackgroundImage }
                                    dimensions={ {
                                        width: 400,
                                        height: 400
                                    } }
                                    value={ mosaicItemFocalPoint }
                                    onChange={ ( focalPoint ) =>_.debounce( updateMosaicItemFocalPoint(focalPoint), 700) } 
                                />
                            </div>
                        </PanelBody>
                        : null}
                    </InspectorControls>
                </div>

                { isSelected ? 
                    (
                    <div>
                        { isModalOpen ? 
                            <DynamicItemsModal
                                existingCollectionId={ collectionId } 
                                existingSearchURL={ searchURL } 
                                onSelectCollection={ (selectedCollectionId) => {
                                    collectionId = selectedCollectionId;
                                    setAttributes({ collectionId: collectionId });
                                    fetchCollectionForHeader();
                                }}
                                onApplySearchURL={ (aSearchURL) =>{
                                    searchURL = aSearchURL
                                    setAttributes({
                                        searchURL: searchURL,
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

                {
                    showCollectionHeader ?
                
                    <div> {
                        isLoadingCollection ? 
                            <div class="spinner-container">
                                <Spinner />
                            </div>
                            :
                            <a
                                    href={ collection.url ? collection.url : '' }
                                    target="_blank"
                                    class="dynamic-items-collection-header">
                                <div
                                        style={{
                                            backgroundColor: collectionBackgroundColor ? collectionBackgroundColor : '', 
                                            paddingRight: collection && collection.thumbnail && (collection.thumbnail['tainacan-medium'] || collection.thumbnail['medium']) ? '' : '20px',
                                            paddingTop: (!collection || !collection.thumbnail || (!collection.thumbnail['tainacan-medium'] && !collection.thumbnail['medium'])) ? '1rem' : '',
                                            width: collection && collection.header_image ? '' : '100%'
                                        }}
                                        className={ 
                                            'collection-name ' + 
                                            ((!collection || !collection.thumbnail || (!collection.thumbnail['tainacan-medium'] && !collection.thumbnail['medium'])) && (!collection || !collection.header_image) ? 'only-collection-name' : '') 
                                        }>
                                    <h3 style={{  color: collectionTextColor ? collectionTextColor : '' }}>
                                        { showCollectionLabel ? <span class="label">{ __('Collection', 'tainacan') }<br/></span> : null }
                                        { collection && collection.name ? collection.name : '' }
                                    </h3>
                                </div>
                                {
                                    collection && collection.thumbnail && (collection.thumbnail['tainacan-medium'] || collection.thumbnail['medium']) ? 
                                        <div   
                                            class="collection-thumbnail"
                                            style={{ 
                                                backgroundImage: 'url(' + (collection.thumbnail['tainacan-medium'] != undefined ? (collection.thumbnail['tainacan-medium'][0]) : (collection.thumbnail['medium'][0])) + ')',
                                            }}/>
                                    : null
                                }  
                                <div
                                        class="collection-header-image"
                                        style={{
                                            backgroundImage: collection.header_image ? 'url(' + collection.header_image + ')' : '',
                                            minHeight: collection && collection.header_image ? '' : '80px',
                                            display: !(collection && collection.thumbnail && (collection.thumbnail['tainacan-medium'] || collection.thumbnail['medium'])) ? collection && collection.header_image ? '' : 'none' : ''  
                                        }}/>
                            </a>  
                        }
                    </div>
                    : null
                }

                {
                    showSearchBar ?
                    <div class="dynamic-items-search-bar">
                        <Button
                            onClick={ () => { order = 'asc'; setAttributes({ order: order }); setContent(); }}
                            className={order == 'asc' ? 'sorting-button-selected' : ''}
                            label={__('Sort ascending', 'tainacan')}>
                            <span class="icon">
                                <i>
                                    <svg width="24" height="24" viewBox="-2 -4 20 20">
                                    <path d="M6.7,10.8l-3.3,3.3L0,10.8h2.5V0h1.7v10.8H6.7z M11.7,0.8H8.3v1.7h3.3V0.8z M14.2,5.8H8.3v1.7h5.8V5.8z M16.7,10.8H8.3v1.7	h8.3V10.8z"/>       
                                    </svg>
                                </i>
                            </span>
                        </Button>  
                        <Button
                            onClick={ () => { order = 'desc'; setAttributes({ order: order }); setContent(); }}
                            className={order == 'desc' ? 'sorting-button-selected' : ''}
                            label={__('Sort descending', 'tainacan')}>
                            <span class="icon">
                                <i>
                                    <svg width="24" height="24" viewBox="-2 -4 20 20">
                                    <path d="M6.7,3.3H4.2v10.8H2.5V3.3H0L3.3,0L6.7,3.3z M11.6,2.5H8.3v1.7h3.3V2.5z M14.1,7.5H8.3v1.7h5.8V7.5z M16.6,12.5H8.3v1.7 h8.3V12.5z"/>
                                    </svg>
                                </i>
                            </span>
                        </Button>  
                        <Button
                            onClick={ () => { setContent(); }}
                            label={__('Search', 'tainacan')}>
                            <span class="icon">
                                <i>
                                    <svg width="24" height="24" viewBox="-2 -4 20 20">
                                    <path class="st0" d="M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5
                                        c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6
                                        c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2
                                        c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2
                                        C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3
                                        c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2
                                        c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"/>       
                                    </svg>
                                </i>
                            </span>
                        </Button>
                        <input
                                value={ searchString }
                                onChange={ (value) =>  { _.debounce(applySearchString(value), 300); } }
                                type="text"/>
                        <Tooltip text={__('If necessary, pagination will be available on post or page.', 'tainacan')}>
                            <button
                                    class="previous-button"
                                    disabled
                                    label={__('Previous page', 'tainacan')}>
                                <span class="icon">
                                    <i>
                                        <svg
                                                width="30"
                                                height="30"
                                                viewBox="0 2 20 20">
                                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                            <path
                                                    d="M0 0h24v24H0z"
                                                    fill="none"/>                        
                                        </svg>
                                    </i>
                                </span>
                            </button>
                        </Tooltip> 
                        <Tooltip text={__('If necessary, pagination will be available on post or page.', 'tainacan')}>
                            <button
                                    class="next-button"
                                    disabled
                                    label={__('Next page', 'tainacan')}>
                                <span class="icon">
                                    <i>
                                        <svg
                                                width="30"
                                                height="30"
                                                viewBox="0 2 20 20">
                                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                            <path
                                                    d="M0 0h24v24H0z"
                                                    fill="none"/>                        
                                        </svg>
                                    </i>
                                </span>
                            </button>   
                        </Tooltip>
                    </div>
                : null
                }

                { !items.length && !isLoading ? (
                    <Placeholder
                        className="tainacan-block-placeholder"
                        icon={(
                            <img
                                width={148}
                                src={ `${tainacan_blocks.base_url}/assets/images/tainacan_logo_header.svg` }
                                alt="Tainacan Logo"/>
                        )}>
                        <p>
                        <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                height="24px"
                                width="24px">
                            <path d="M14,2V4H7v7.24A5.33,5.33,0,0,0,5.5,11a4.07,4.07,0,0,0-.5,0V4A2,2,0,0,1,7,2Zm7,10v8a2,2,0,0,1-2,2H12l1-1-2.41-2.41A5.56,5.56,0,0,0,11,16.53a5.48,5.48,0,0,0-2-4.24V8a2,2,0,0,1,2-2h4Zm-2.52,0L14,7.5V12ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1-.5-7,2.74,2.74,0,0,1,.5,0,3.41,3.41,0,0,1,1.5.34,3.5,3.5,0,0,1,2,3.16,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,0,0,5.5,15a1.39,1.39,0,0,0-.5.09A1.5,1.5,0,0,0,5.5,18a1.48,1.48,0,0,0,1.42-1A1.5,1.5,0,0,0,7,16.53Z"/>
                        </svg>
                            {__('Dynamically list items from a Tainacan items search', 'tainacan')}
                        </p>
                        <Button
                            isPrimary
                            type="button"
                            onClick={ () => openDynamicItemsModal() }>
                            {__('Configure search', 'tainacan')}
                        </Button>   
                    </Placeholder>
                    ) : null
                }
                
                { isLoading ? 
                    <div class="spinner-container">
                        <Spinner />
                    </div> :
                    <div>
                        { layout !== 'mosaic' ? (
                            <ul 
                                style={{
                                    gridGap: layout == 'grid' ? ((showName ? gridMargin + 24 : gridMargin) + 'px') : 'inherit',
                                    marginTop: showSearchBar || showCollectionHeader ? '-' + (Number(gridMargin)/2) : '0px',    
                                    padding: (Number(gridMargin)/4) + 'px',
                                }}
                                className={'items-list-edit items-layout-' + layout + (!showName ? ' items-list-without-margin' : '') + (maxColumnsCount ? ' max-columns-count-' + maxColumnsCount : '') }>
                                { items }
                            </ul>
                        ) : 
                            <ResizableBox
                                size={ {
                                    height: mosaicHeight ? mosaicHeight + (3 * gridMargin) : 280 + (3 * gridMargin),
                                    width: '100%'
                                } }
                                minHeight="80"
                                maxHeight="2000"
                                minWidth="100%"
                                maxWidth="100%"
                                showHandle={ true }
                                enable={ {
                                    top: false,
                                    right: false,
                                    bottom: true,
                                    left: false,
                                    topRight: false,
                                    bottomRight: true,
                                    bottomLeft: true,
                                    topLeft: false,
                                } }
                                onResizeStop={ ( event, direction, elt, delta ) => {
                                    mosaicHeight = delta.height ? parseInt(delta.height) + parseInt(mosaicHeight) : 280;
                                    setAttributes({ mosaicHeight: parseInt(mosaicHeight) });
                                    setContent();
                                } }
                            >
                                <ul 
                                    style={{
                                        marginTop: showSearchBar || showCollectionHeader ? '-' + (Number(gridMargin)/2) : '0px',    
                                        padding: (Number(gridMargin)/4) + 'px',
                                        minHeight: mosaicHeight + 'px'
                                    }}
                                    className={'items-list-edit items-layout-' + layout + (!showName ? ' items-list-without-margin' : '')}>
                                    { items }
                                </ul>
                            </ResizableBox>
                        }
                    </div>
                }
            </div>
        );
    },
    save({ attributes, className }){
        const {
            content, 
            blockId,
            collectionId,  
            showImage,
            showName,
            layout,
            gridMargin,
            searchURL,
            maxItemsNumber,
            order,
            showSearchBar,
            showCollectionHeader,
            showCollectionLabel,
            collectionBackgroundColor,
            collectionTextColor,
            mosaicHeight,
            mosaicGridRows,
            mosaicGridColumns,
            mosaicItemFocalPoint,
            mosaicDensity,
            maxColumnsCount,
            cropImagesToSquare
        } = attributes;

        return <div 
                    search-url={ searchURL }
                    className={ className }
                    collection-id={ collectionId }  
                    show-image={ '' + showImage }
                    show-name={ '' + showName }
                    show-search-bar={ '' + showSearchBar }
                    show-collection-header={ '' + showCollectionHeader }
                    show-collection-label={ '' + showCollectionLabel }
                    crop-images-to-square={ '' + cropImagesToSquare }
                    layout={ layout }
                    mosaic-height={ mosaicHeight }
                    mosaic-density={ mosaicDensity }
                    mosaic-grid-rows={ mosaicGridRows } 
                    mosaic-grid-columns={ mosaicGridColumns }
                    mosaic-item-focal-point-x={ (mosaicItemFocalPoint && mosaicItemFocalPoint.x ? mosaicItemFocalPoint.x : 0.5) } 
                    mosaic-item-focal-point-y={ (mosaicItemFocalPoint && mosaicItemFocalPoint.y ? mosaicItemFocalPoint.y : 0.5) } 
                    max-columns-count={ maxColumnsCount }
                    collection-background-color={ collectionBackgroundColor }
                    collection-text-color={ collectionTextColor }
                    grid-margin={ gridMargin }
                    max-items-number={ maxItemsNumber }
                    order={ order }
                    tainacan-api-root={ tainacan_blocks.root }
                    tainacan-base-url={ tainacan_blocks.base_url }
                    id={ 'wp-block-tainacan-dynamic-items-list_' + blockId }>
                        { content }
                </div>
    },
    deprecated: DeprecatedBlocks
});