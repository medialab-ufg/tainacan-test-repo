const { registerBlockType } = wp.blocks;

const { __ } = wp.i18n;

const { RangeControl, Spinner, Button, ToggleControl, SelectControl, Placeholder, IconButton, ColorPicker, ColorPalette, BaseControl, PanelBody } = wp.components;

const { InspectorControls, BlockControls } = ( tainacan_blocks.wp_version < '5.2' ? wp.editor : wp.blockEditor );

import CarouselItemsModal from './carousel-items-modal.js';
import tainacan from '../../js/axios.js';
import axios from 'axios';
import qs from 'qs';
import { ThumbnailHelperFunctions } from '../../../admin/js/utilities.js';
import TainacanBlocksCompatToolbar from '../../js/tainacan-blocks-compat-toolbar.js';
import DeprecatedBlocks from './carousel-items-deprecated.js';
import 'swiper/css/swiper.min.css';

registerBlockType('tainacan/carousel-items-list', {
    title: __('Tainacan Collection\'s Items Carousel', 'tainacan'),
    icon:
        <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
                class="tainacan-block-icon">
            <path
                fill="#298596"
                d="M16,6H12a2,2,0,0,0-2,2v6.52A6,6,0,0,1,12,19a6,6,0,0,1-.73,2.88A1.92,1.92,0,0,0,12,22h8a2,2,0,0,0,2-2V12Zm-1,6V7.5L19.51,12ZM15,2V4H8v9.33A5.8,5.8,0,0,0,6,13V4A2,2,0,0,1,8,2ZM10.09,19.05,7,22.11V16.05L8,17l2,2ZM5,16.05v6.06L2,19.11Z"/>
        </svg>,
    category: 'tainacan-blocks',
    keywords: [ __( 'items', 'tainacan' ), __( 'carousel', 'tainacan' ), __( 'slider', 'tainacan' ) ],
    description: __('List items on a Carousel, using search or item selection.', 'tainacan'),
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
        isModalOpen: {
            type: Boolean,
            default: false
        },
        searchURL: {
            type: String,
            default: undefined
        },
        selectedItems: {
            type: Array,
            default: []
        },
        itemsRequestSource: {
            type: String,
            default: undefined
        },
        maxItemsNumber: {
            type: Number,
            value: undefined
        },
        maxItemsPerScreen: {
            type: Number,
            value: 7
        },
        isLoading: {
            type: Boolean,
            value: false
        },
        isLoadingCollection: {
            type: Boolean,
            value: false
        },
        loadStrategy: {
            type: String,
            value: 'search'
        },
        arrowsPosition: {
            type: String,
            value: 'search'
        },
        largeArrows: {
            type: Boolean,
            value: false
        },
        autoPlay: {
            type: Boolean,
            value: false
        },
        autoPlaySpeed: {
            type: Number,
            value: 3
        },
        loopSlides: {
            type: Boolean,
            value: false
        },
        hideTitle: {
            type: Boolean,
            value: true
        },
        showCollectionHeader: {
            type: Boolean,
            value: false
        },
        showCollectionLabel: {
            type: Boolean,
            value: false
        },
        cropImagesToSquare: {
            type: Boolean,
            value: true
        },
        collection: {
            type: Object,
            value: undefined
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
        }
    },
    supports: {
        align: ['full', 'wide'],
        html: false,
        multiple: true,
        fontSize: true
    },
    edit({ attributes, setAttributes, className, isSelected, clientId }){
        let {
            items, 
            content, 
            collectionId,  
            isModalOpen,
            searchURL,
            itemsRequestSource,
            maxItemsNumber,
            maxItemsPerScreen,
            selectedItems,
            isLoading,
            loadStrategy,
            arrowsPosition,
            largeArrows,
            autoPlay,
            autoPlaySpeed,
            loopSlides,
            hideTitle,
            cropImagesToSquare,
            showCollectionHeader,
            showCollectionLabel,
            isLoadingCollection,
            collection,
            collectionBackgroundColor,
            collectionTextColor
        } = attributes;

        // Obtains block's client id to render it on save function
        setAttributes({ blockId: clientId });
        const thumbHelper = ThumbnailHelperFunctions();

        // Sets some defaults that were not working
        if (maxItemsPerScreen === undefined) {
            maxItemsPerScreen = 7;
            setAttributes({ maxItemsPerScreen: maxItemsPerScreen });
        }
        if (cropImagesToSquare === undefined) {  
            cropImagesToSquare = true;    
            setAttributes({ cropImagesToSquare: cropImagesToSquare });
        }

        function prepareItem(item) {
            return (
                <li 
                    key={ item.id }
                    className={ 'item-list-item ' + (maxItemsPerScreen ? 'max-itens-per-screen-' + maxItemsPerScreen : '') }>   
                    { loadStrategy == 'selection' ?
                        ( tainacan_blocks.wp_version < '5.4' ?
                            <IconButton
                                onClick={ () => removeItemOfId(item.id) }
                                icon="no-alt"
                                label={__('Remove', 'tainacan')}/>
                            :
                            <Button
                                onClick={ () => removeItemOfId(item.id) }
                                icon="no-alt"
                                label={__('Remove', 'tainacan')}/>
                        )
                        :null
                    }   
                    <a 
                        id={ isNaN(item.id) ? item.id : 'item-id-' + item.id }
                        href={ item.url } 
                        target="_blank">
                        <img
                            src={ thumbHelper.getSrc(item['thumbnail'], (maxItemsPerScreen > 4 ? (!cropImagesToSquare ? 'tainacan-medium-full' : 'tainacan-medium') : 'large'), item['document_mimetype']) }
                            srcSet={ thumbHelper.getSrcSet(item['thumbnail'], (maxItemsPerScreen > 4 ? (!cropImagesToSquare ? 'tainacan-medium-full' : 'tainacan-medium') : 'large'), item['document_mimetype']) }
                            alt={ item.thumbnail_alt ? item.thumbnail_alt : (item && item.title ? item.title : __( 'Thumbnail', 'tainacan' )) }/>
                        { !hideTitle ? <span>{ item.title ? item.title : '' }</span> : null }
                    </a>
                </li>
            );
        }

        function setContent(){
            isLoading = true;

            setAttributes({
                isLoading: isLoading
            });

            if (itemsRequestSource != undefined && typeof itemsRequestSource == 'function')
                itemsRequestSource.cancel('Previous items search canceled.');

            itemsRequestSource = axios.CancelToken.source();

            items = [];

            if (loadStrategy == 'selection') {
                let endpoint = '/collection/' + collectionId + '/items?'+ qs.stringify({ postin: selectedItems, perpage: selectedItems.length }) + '&fetch_only=title,url,thumbnail';

                tainacan.get(endpoint, { cancelToken: itemsRequestSource.token })
                    .then(response => {

                        for (let item of response.data.items)
                            items.push(prepareItem(item));

                        setAttributes({
                            content: <div></div>,
                            items: items,
                            isLoading: false,
                            itemsRequestSource: itemsRequestSource
                        });
                    });
            } else {

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

                // Remove unecessary queries
                delete queryObject.readmode;
                delete queryObject.iframemode;
                delete queryObject.admin_view_mode;
                delete queryObject.fetch_only_meta;
                
                endpoint = endpoint.split('?')[0] + '?' + qs.stringify(queryObject) + '&fetch_only=title,url,thumbnail';
                
                tainacan.get(endpoint, { cancelToken: itemsRequestSource.token })
                    .then(response => {

                        for (let item of response.data.items)
                            items.push(prepareItem(item));

                        setAttributes({
                            content: <div></div>,
                            items: items,
                            isLoading: false,
                            itemsRequestSource: itemsRequestSource
                        });
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

        function openCarouseltemsModal(aLoadStrategy) {
            loadStrategy = aLoadStrategy;
            isModalOpen = true;
            setAttributes( { 
                isModalOpen: isModalOpen,
                loadStrategy: loadStrategy
            } );
        }

        function removeItemOfId(itemId) {

            let existingItemIndex = items.findIndex((existingItem) => existingItem.key == itemId);
            if (existingItemIndex >= 0)
                items.splice(existingItemIndex, 1);

            let existingSelectedItemIndex = selectedItems.findIndex((existingSelectedItem) => existingSelectedItem == itemId);
            if (existingSelectedItemIndex >= 0)
                selectedItems.splice(existingSelectedItemIndex, 1);
        
            setAttributes({ 
                selectedItems: selectedItems,
                items: items,
                content: <div></div> 
            });

        }

        // Executed only on the first load of page
        if(content && content.length && content[0].type)
            setContent();

        return content == 'preview' ? 
                <div className={className}>
                    <img
                            width="100%"
                            src={ `${tainacan_blocks.base_url}/assets/images/carousel-items-list.png` } />
                </div>
            : (
            <div className={className}>

                { items.length ?
                    <BlockControls>
                        { loadStrategy != 'search' ?
                            TainacanBlocksCompatToolbar({
                                label: __('Add more items', 'tainacan'),
                                icon: <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            height="24px"
                                            width="24px">
                                        <path d="M16,6H12a2,2,0,0,0-2,2v6.52A6,6,0,0,1,12,19a6,6,0,0,1-.73,2.88A1.92,1.92,0,0,0,12,22h8a2,2,0,0,0,2-2V12Zm-1,6V7.5L19.51,12ZM15,2V4H8v9.33A5.8,5.8,0,0,0,6,13V4A2,2,0,0,1,8,2ZM10.09,19.05,7,22.11V16.05L8,17l2,2ZM5,16.05v6.06L2,19.11Z"/>
                                    </svg>,
                                onClick: openCarouseltemsModal,
                                onClickParams: 'selection'
                            })
                            :
                            TainacanBlocksCompatToolbar({
                                label: __('Configure a search', 'tainacan'),
                                icon: <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            height="24px"
                                            width="24px">
                                        <path d="M16,6H12a2,2,0,0,0-2,2v6.52A6,6,0,0,1,12,19a6,6,0,0,1-.73,2.88A1.92,1.92,0,0,0,12,22h8a2,2,0,0,0,2-2V12Zm-1,6V7.5L19.51,12ZM15,2V4H8v9.33A5.8,5.8,0,0,0,6,13V4A2,2,0,0,1,8,2ZM10.09,19.05,7,22.11V16.05L8,17l2,2ZM5,16.05v6.06L2,19.11Z"/>
                                    </svg>,
                                onClick: openCarouseltemsModal,
                                onClickParams: 'search'
                            }) 
                        }
                    </BlockControls>
                : null }
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
                                title={__('Carousel', 'tainacan')}
                                initialOpen={ true }
                            >
                            <div>
                                <RangeControl
                                        label={ __('Maximum items per slide on a wide screen', 'tainacan') }
                                        help={ maxItemsPerScreen <= 4 ? __('Warning: with such a small number of items per slide, the image size is greater, thus the cropped version of the thumbnail won\'t be used.', 'tainacan') : null }
                                        value={ maxItemsPerScreen ? maxItemsPerScreen : 7 }
                                        onChange={ ( aMaxItemsPerScreen ) => {
                                            maxItemsPerScreen = aMaxItemsPerScreen;
                                            setAttributes( { maxItemsPerScreen: aMaxItemsPerScreen } );
                                            setContent(); 
                                        }}
                                        min={ 1 }
                                        max={ 9 }
                                    />
                                <ToggleControl
                                        label={__('Crop Images', 'tainacan')}
                                        help={ cropImagesToSquare && maxItemsPerScreen > 4 ? __('Do not use square cropeed version of the item thumbnail.', 'tainacan') : __('Toggle to use square cropped version of the item thumbnail.', 'tainacan') }
                                        checked={ cropImagesToSquare && maxItemsPerScreen > 4 }
                                        onChange={ ( isChecked ) => {
                                                cropImagesToSquare = isChecked;
                                                setAttributes({ cropImagesToSquare: cropImagesToSquare });
                                                setContent();
                                            } 
                                        }
                                    />
                                <ToggleControl
                                        label={__('Hide title', 'tainacan')}
                                        help={ !hideTitle ? __('Toggle to hide item\'s title', 'tainacan') : __('Do not hide item\'s title', 'tainacan')}
                                        checked={ hideTitle }
                                        onChange={ ( isChecked ) => {
                                                hideTitle = isChecked;
                                                setAttributes({ hideTitle: hideTitle });
                                                setContent();
                                            } 
                                        }
                                    />
                                <ToggleControl
                                        label={__('Loop slides', 'tainacan')}
                                        help={ !loopSlides ? __('Toggle to make slides loop from first to last', 'tainacan') : __('Do not loop slides from first to last', 'tainacan')}
                                        checked={ loopSlides }
                                        onChange={ ( isChecked ) => {
                                                loopSlides = isChecked;
                                                setAttributes({ loopSlides: loopSlides });
                                            } 
                                        }
                                    />
                                <ToggleControl
                                        label={__('Auto play', 'tainacan')}
                                        help={ !autoPlay ? __('Toggle to automatically slide to the next item', 'tainacan') : __('Do not automatically slide to the next item', 'tainacan')}
                                        checked={ autoPlay }
                                        onChange={ ( isChecked ) => {
                                                autoPlay = isChecked;
                                                setAttributes({ autoPlay: autoPlay });
                                            } 
                                        }
                                    />
                                { 
                                    autoPlay ? 
                                        <RangeControl
                                            label={__('Seconds before sliding to the next', 'tainacan')}
                                            value={ autoPlaySpeed }
                                            onChange={ ( aAutoPlaySpeed ) => {
                                                autoPlaySpeed = aAutoPlaySpeed;
                                                setAttributes( { autoPlaySpeed: aAutoPlaySpeed } ) 
                                            }}
                                            min={ 1 }
                                            max={ 5 }
                                        />
                                    : null
                                }
                                <SelectControl
                                    label={__('Arrows', 'tainacan')}
                                    value={ arrowsPosition }
                                    options={ [
                                        { label: __('Around', 'tainacan'), value: 'around' },
                                        { label: __('Left', 'tainacan'), value: 'left' },
                                        { label: __('Right', 'tainacan'), value: 'right' }
                                    ] }
                                    onChange={ ( aPosition ) => { 
                                        arrowsPosition = aPosition;

                                        setAttributes({ arrowsPosition: arrowsPosition }); 
                                    }}/>
                                <ToggleControl
                                    label={__('Large arrows', 'tainacan')}
                                    help={ !largeArrows ? __('Toggle to display arrows bigger than the default size.', 'tainacan') : __('Do not show arrows bigger than the default size.', 'tainacan')}
                                    checked={ largeArrows }
                                    onChange={ ( isChecked ) => {
                                            largeArrows = isChecked;
                                            setAttributes({ largeArrows: largeArrows });
                                        } 
                                    }
                                />
                            </div>                           
                        </PanelBody>

                        { loadStrategy == 'search' ?
                            <PanelBody
                                    title={__('Item\'s Search', 'tainacan')}
                                    initialOpen={ true }
                                >
                                <div>
                                    <RangeControl
                                        label={__('Maximum number of items to load', 'tainacan')}
                                        value={ maxItemsNumber }
                                        onChange={ ( aMaxItemsNumber ) => {
                                            maxItemsNumber = aMaxItemsNumber;
                                            setAttributes( { maxItemsNumber: aMaxItemsNumber } ) 
                                            setContent();
                                        }}
                                        min={ 1 }
                                        max={ 96 }
                                    />
                                </div>                           
                            </PanelBody>
                            :null
                        }
                    </InspectorControls>
                </div>

                { isSelected ? 
                    ( 
                    <div>
                        { isModalOpen ?   
                            <CarouselItemsModal
                                loadStrategy={ loadStrategy }
                                existingCollectionId={ collectionId }
                                existingSearchURL={ loadStrategy == 'search' ? searchURL : false } 
                                onSelectCollection={ (selectedCollectionId) => {
                                    if (collectionId != selectedCollectionId) {
                                        items = [];
                                        selectedItems = [];
                                    }
                                    collectionId = selectedCollectionId;
                                    setAttributes({ 
                                        collectionId: collectionId,
                                        items: items,
                                        selectedItems: selectedItems
                                    });
                                }}
                                onApplySearchURL={ (aSearchURL) => {
                                    searchURL = aSearchURL;
                                    loadStrategy = 'search';
                                    setAttributes({
                                        searchURL: searchURL,
                                        loadStrategy: loadStrategy,
                                        isModalOpen: false
                                    });
                                    setContent();
                                }}
                                onApplySelectedItems={ (aSelectionOfItems) => {
                                    selectedItems = selectedItems.concat(aSelectionOfItems); 
                                    loadStrategy = 'selection';
                                    setAttributes({
                                        selectedItems: selectedItems,
                                        loadStrategy: loadStrategy,
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
                                    class="carousel-items-collection-header">
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
                                <path d="M16,6H12a2,2,0,0,0-2,2v6.52A6,6,0,0,1,12,19a6,6,0,0,1-.73,2.88A1.92,1.92,0,0,0,12,22h8a2,2,0,0,0,2-2V12Zm-1,6V7.5L19.51,12ZM15,2V4H8v9.33A5.8,5.8,0,0,0,6,13V4A2,2,0,0,1,8,2ZM10.09,19.05,7,22.11V16.05L8,17l2,2ZM5,16.05v6.06L2,19.11Z"/>
                            </svg>
                            {__('List items on a Carousel, using search or item selection.', 'tainacan')}
                        </p>
                        <Button
                            isPrimary
                            type="button"
                            onClick={ () => openCarouseltemsModal('selection') }>
                            {__('Select Items', 'tainacan')}
                        </Button> 
                        <p style={{ margin: '0 12px' }}>{__('or', 'tainacan')}</p>
                        <Button
                            isPrimary
                            type="button"
                            onClick={ () => openCarouseltemsModal('search') }>
                            {__('Configure a search', 'tainacan')}
                        </Button>    
                    </Placeholder>
                    ) : null
                }
                
                { isLoading ? 
                    <div class="spinner-container">
                        <Spinner />
                    </div> :
                    <div>
                        { isSelected && items.length ? 
                            <div class="preview-warning">{__('Warning: this is just a demonstration. To see the carousel in action, either preview or publish your post.', 'tainacan')}</div>
                            : null
                        }
                        {  items.length ? (

                            <div
                                    className={'items-list-edit-container ' + (arrowsPosition ? ' has-arrows-' + arrowsPosition : '') + (largeArrows ? ' has-large-arrows' : '') }>
                                <button 
                                        class="swiper-button-prev" 
                                        slot="button-prev"
                                        style={{ cursor: 'not-allowed' }}>
                                    <svg
                                            width={ largeArrows ? 60 : 42 }
                                            height={ largeArrows ? 60 : 42 }
                                            viewBox="0 0 24 24">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                        <path
                                                d="M0 0h24v24H0z"
                                                fill="none"/>                         
                                    </svg>
                                </button>
                                <ul 
                                    style={{ 
                                        marginTop: showCollectionHeader ? '1.5rem' : '0px'
                                    }}
                                    className={ 'items-list-edit' }>
                                    { items }
                                </ul>
                                <button 
                                        class="swiper-button-next" 
                                        slot="button-next"
                                        style={{ cursor: 'not-allowed' }}>
                                    <svg
                                            width={ largeArrows ? 60 : 42 }
                                            height={ largeArrows ? 60 : 42 }
                                            viewBox="0 0 24 24">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                        <path
                                                d="M0 0h24v24H0z"
                                                fill="none"/>                        
                                    </svg>
                                </button>
                            </div>
                        ):null
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
            searchURL,
            selectedItems,
            arrowsPosition,
            largeArrows,
            loadStrategy,
            maxItemsNumber,
            maxItemsPerScreen,
            autoPlay,
            autoPlaySpeed,
            loopSlides,
            hideTitle,
            cropImagesToSquare,
            showCollectionHeader,
            showCollectionLabel,
            collectionBackgroundColor,
            collectionTextColor
        } = attributes;
        
        return <div 
                    className={ className }
                    search-url={ searchURL }
                    selected-items={ JSON.stringify(selectedItems) }
                    arrows-position={ arrowsPosition }
                    load-strategy={ loadStrategy }
                    collection-id={ collectionId }  
                    auto-play={ '' + autoPlay }
                    auto-play-speed={ autoPlaySpeed }
                    loop-slides={ '' + loopSlides }
                    hide-title={ '' + hideTitle }
                    large-arrows={ '' + largeArrows }
                    crop-images-to-square={ '' + cropImagesToSquare }
                    show-collection-header={ '' + showCollectionHeader }
                    show-collection-label={ '' + showCollectionLabel }
                    collection-background-color={ collectionBackgroundColor }
                    collection-text-color={ collectionTextColor }
                    max-items-number={ maxItemsNumber }
                    max-items-per-screen={ maxItemsPerScreen }
                    tainacan-api-root={ tainacan_blocks.root }
                    tainacan-base-url={ tainacan_blocks.base_url }
                    id={ 'wp-block-tainacan-carousel-items-list_' + blockId }>
                        { content }
                </div>
    },
    deprecated: DeprecatedBlocks
});