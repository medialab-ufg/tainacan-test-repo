const { registerBlockType } = wp.blocks;

const { __ } = wp.i18n;

const { RangeControl, Spinner, Button, BaseControl, ToggleControl, SelectControl, Placeholder, IconButton, PanelBody } = wp.components;

const { InspectorControls, BlockControls } = ( tainacan_blocks.wp_version < '5.2' ? wp.editor : wp.blockEditor );

import TermsModal from '../terms-list/terms-modal.js';
import tainacan from '../../js/axios.js';
import axios from 'axios';
import qs from 'qs';
import { ThumbnailHelperFunctions } from '../../../admin/js/utilities.js';
import TainacanBlocksCompatToolbar from '../../js/tainacan-blocks-compat-toolbar.js';
import DeprecatedBlocks from './carousel-terms-list-deprecated.js';
import 'swiper/css/swiper.min.css';

registerBlockType('tainacan/carousel-terms-list', {
    title: __('Tainacan Terms Carousel', 'tainacan'),
    icon:
        <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
                class="tainacan-block-icon">
            <path
                fill="#298596"
                d="M21.43,14.64,19.32,17a2.57,2.57,0,0,1-2,1H12.05a6,6,0,0,0-6-6H6V10.64A2.59,2.59,0,0,1,8.59,8H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,14.64ZM4,4A2,2,0,0,0,2,6v7.63a5.74,5.74,0,0,1,2-1.2V6H16V4ZM7,15.05v6.06l3.06-3.06ZM5,21.11V15.05L1.94,18.11Z"/>
        </svg>,
    category: 'tainacan-blocks',
    keywords: [ __( 'carousel', 'tainacan' ), __( 'slider', 'tainacan' ),  __( 'taxonomy', 'tainacan' ) ],
    description: __('List terms on a Carousel, showing their thumbnails or a preview of items.', 'tainacan'),
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
        terms: {
            type: Array,
            default: []
        },
        isModalOpen: {
            type: Boolean,
            default: false
        },
        selectedTerms: {
            type: Array,
            default: []
        },
        itemsRequestSource: {
            type: String,
            default: undefined
        },
        maxTermsNumber: {
            type: Number,
            value: undefined
        },
        maxTermsPerScreen: {
            type: Number,
            value: 6
        },
        isLoading: {
            type: Boolean,
            value: false
        },
        isLoadingTerm: {
            type: Boolean,
            value: false
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
        hideName: {
            type: Boolean,
            value: true
        },
        showTermThumbnail: {
            type: Boolean,
            value: false
        },
        term: {
            type: Object,
            value: undefined
        },
        blockId: {
            type: String,
            default: undefined
        },
        termBackgroundColor: {
            type: String,
            default: "#454647"
        },
        termTextColor: {
            type: String,
            default: "#ffffff"
        },
        taxonomyId: {
            type: String,
            default: undefined
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
            terms, 
            content, 
            isModalOpen,
            itemsRequestSource,
            selectedTerms,
            isLoading,
            largeArrows,
            maxTermsPerScreen,
            arrowsPosition,
            autoPlay,
            autoPlaySpeed,
            loopSlides,
            hideName,
            showTermThumbnail,
            taxonomyId
        } = attributes;

        // Obtains block's client id to render it on save function
        setAttributes({ blockId: clientId });
        
        // Sets some defaults that were not working
        if (maxTermsPerScreen === undefined) {
            maxTermsPerScreen = 6;
            setAttributes({ maxTermsPerScreen: maxTermsPerScreen });
        }

        const thumbHelper = ThumbnailHelperFunctions();

        function prepareItem(term, termItems) {
            return (
                <li 
                    key={ term.id }
                    className={ 'term-list-item ' + (!showTermThumbnail ? 'term-list-item-grid ' : '') + (maxTermsPerScreen ? ' max-terms-per-screen-' + maxTermsPerScreen : '') }>   
                    { tainacan_blocks.wp_version < '5.4' ?
                        <IconButton
                            onClick={ () => removeItemOfId(term.id) }
                            icon="no-alt"
                            label={__('Remove', 'tainacan')}/>
                        :
                        <Button
                            onClick={ () => removeItemOfId(term.id) }
                            icon="no-alt"
                            label={__('Remove', 'tainacan')}/>
                    }
                    <a 
                        id={ isNaN(term.id) ? term.id : 'term-id-' + term.id }
                        href={ term.url } 
                        target="_blank">
                        { !showTermThumbnail ? 
                            <div class="term-items-grid">
                                <img 
                                    src={ termItems[0] ? thumbHelper.getSrc(termItems[0]['thumbnail'], 'tainacan-medium', termItems[0]['document_mimetype']) :`${tainacan_blocks.base_url}/assets/images/placeholder_square.png` }
                                    srcSet={ termItems[0] ? thumbHelper.getSrcSet(termItems[0]['thumbnail'], 'tainacan-medium', termItems[0]['document_mimetype']) :`${tainacan_blocks.base_url}/assets/images/placeholder_square.png` }
                                    alt={ termItems[0] && termItems[0].thumbnail_alt ? termItems[0].thumbnail_alt : (termItems[0] && termItems[0].name ? termItems[0].name : __( 'Thumbnail', 'tainacan' )) } />
                                <img 
                                        src={ termItems[1] ? thumbHelper.getSrc(termItems[1]['thumbnail'], 'tainacan-medium', termItems[1]['document_mimetype']) :`${tainacan_blocks.base_url}/assets/images/placeholder_square.png` }
                                        srcSet={ termItems[1] ? thumbHelper.getSrcSet(termItems[1]['thumbnail'], 'tainacan-medium', termItems[1]['document_mimetype']) :`${tainacan_blocks.base_url}/assets/images/placeholder_square.png` }
                                        alt={ termItems[1] && termItems[1].thumbnail_alt ? termItems[1].thumbnail_alt : (termItems[1] && termItems[1].name ? termItems[1].name : __( 'Thumbnail', 'tainacan' )) } />
                                <img 
                                        src={ termItems[2] ? thumbHelper.getSrc(termItems[2]['thumbnail'], 'tainacan-medium', termItems[2]['document_mimetype']) :`${tainacan_blocks.base_url}/assets/images/placeholder_square.png` }
                                        srcSet={ termItems[2] ? thumbHelper.getSrcSet(termItems[2]['thumbnail'], 'tainacan-medium', termItems[2]['document_mimetype']) :`${tainacan_blocks.base_url}/assets/images/placeholder_square.png` }
                                        alt={ termItems[2] && termItems[2].thumbnail_alt ? termItems[2].thumbnail_alt : (termItems[2] && termItems[2].name ? termItems[2].name : __( 'Thumbnail', 'tainacan' )) } />
                            </div>
                            :
                            <img
                                src={ term.header_image ? term.header_image : `${tainacan_blocks.base_url}/assets/images/placeholder_square.png`}
                                alt={ term.name ? term.name : __( 'Thumbnail', 'tainacan' )}/>
                        }
                        { !hideName ? <span>{ term.name ? term.name : '' }</span> : null }
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
                itemsRequestSource.cancel('Previous terms search canceled.');

            itemsRequestSource = axios.CancelToken.source();

            terms = [];

            let endpoint = '/taxonomy/' + taxonomyId + '/terms/?'+ qs.stringify({ hideempty: 0, include: selectedTerms.map((term) => { return term.id; }) }) + '&order=asc&fetch_only=id,name,url,header_image';
            tainacan.get(endpoint, { cancelToken: itemsRequestSource.token })
                .then(response => {

                    if (showTermThumbnail) {
                        for (let term of response.data) { 
                            terms.push(prepareItem(term));
                        }
                        setAttributes({
                            content: <div></div>,
                            terms: terms,
                            isLoading: false,
                            itemsRequestSource: itemsRequestSource
                        });
                    } else {
                        let promises = [];
                        for (let term of response.data) {  
                            promises.push(
                                tainacan.get('/items/?perpage=3&fetch_only=name,url,thumbnail&taxquery[0][taxonomy]=tnc_tax_' + taxonomyId + '&taxquery[0][terms][0]=' + term.id + '&taxquery[0][compare]=IN')
                                    .then(response => { return({ term: term, termItems: response.data.items }) })
                                    .catch((error) => console.log(error))
                            );                      
                        }
                        axios.all(promises).then((results) => {
                            for (let result of results) {
                                terms.push(prepareItem(result.term, result.termItems));
                            }
                            setAttributes({
                                content: <div></div>,
                                terms: terms,
                                isLoading: false,
                                itemsRequestSource: itemsRequestSource
                            });
                        })  
                    }
                });
        }

        function openCarouselModal() {
            isModalOpen = true;
            setAttributes( { 
                isModalOpen: isModalOpen
            } );
        }

        function removeItemOfId(itemId) {

            let existingItemIndex = terms.findIndex((existingItem) => existingItem.key == itemId);
            if (existingItemIndex >= 0)
                terms.splice(existingItemIndex, 1);

            let existingSelectedItemIndex = selectedTerms.findIndex((existingSelectedItem) => existingSelectedItem.id == itemId);
            if (existingSelectedItemIndex >= 0)
                selectedTerms.splice(existingSelectedItemIndex, 1);
        
            setAttributes({ 
                selectedTerms: selectedTerms,
                terms: terms,
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
                            src={ `${tainacan_blocks.base_url}/assets/images/carousel-terms-list.png` } />
                </div>
            : (
            <div className={className}>

                { terms.length ?
                    <BlockControls>
                        {
                            TainacanBlocksCompatToolbar({
                                label: __('Add more terms', 'tainacan'),
                                icon: <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 -2 24 24"
                                            height="24px"
                                            width="24px">
                                        <path d="M21.43,14.64,19.32,17a2.57,2.57,0,0,1-2,1H12.05a6,6,0,0,0-6-6H6V10.64A2.59,2.59,0,0,1,8.59,8H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,14.64ZM4,4A2,2,0,0,0,2,6v7.63a5.74,5.74,0,0,1,2-1.2V6H16V4ZM7,15.05v6.06l3.06-3.06ZM5,21.11V15.05L1.94,18.11Z"/>
                                    </svg>,
                                onClick: openCarouselModal
                            })
                        }
                    </BlockControls>
                : null }

                <div>
                    <InspectorControls>

                        <PanelBody
                                title={__('Carousel', 'tainacan')}
                                initialOpen={ true }
                            >
                                <BaseControl
                                        id="term-carousel-view-modes"
                                        label={ __('Term layout', 'tainacan')}>
                                    <div className="term-carousel-view-modes">
                                        <button
                                                onClick={ () => {
                                                        showTermThumbnail = false;
                                                        setAttributes({ showTermThumbnail: showTermThumbnail });
                                                        setContent();    
                                                    }
                                                }
                                                className={'term-carousel-view-mode-grid' + (showTermThumbnail ? '' : ' is-active')}>
                                            <div>
                                                <div />
                                            <div />
                                            <div />
                                            </div>
                                            <label>{ __('Items\'s grid', 'tainacan') }</label>
                                        </button>
                                        <button
                                                onClick={ () => {
                                                        showTermThumbnail = true;
                                                        setAttributes({ showTermThumbnail: showTermThumbnail });
                                                        setContent();    
                                                    }
                                                }
                                                className={'term-carousel-view-mode-thumbnail' + (showTermThumbnail ? ' is-active' : '')}>
                                            <div />
                                            <label>{ __('Thumbnail', 'tainacan') }</label>
                                        </button>    
                                    </div>
                                </BaseControl>
                                <RangeControl
                                        label={ __('Maximum terms per slide on a wide screen', 'tainacan') }
                                        help={ (showTermThumbnail && maxTermsPerScreen <= 3) ? __('Warning: with such a small number of terms per slide, the image size is greater and might be pixelated.', 'tainacan') : null }
                                        value={ maxTermsPerScreen ? maxTermsPerScreen : 6 }
                                        onChange={ ( aMaxTermsPerScreen ) => {
                                            maxTermsPerScreen = aMaxTermsPerScreen;
                                            setAttributes( { maxTermsPerScreen: aMaxTermsPerScreen } );
                                            setContent(); 
                                        }}
                                        min={ 1 }
                                        max={ 9 }
                                    />
                                <ToggleControl
                                        label={__('Hide name', 'tainacan')}
                                        help={ !hideName ? __('Toggle to hide term\'s name', 'tainacan') : __('Do not hide term\'s name', 'tainacan')}
                                        checked={ hideName }
                                        onChange={ ( isChecked ) => {
                                                hideName = isChecked;
                                                setAttributes({ hideName: hideName });
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
                                        help={ !autoPlay ? __('Toggle to automatically slide to next term', 'tainacan') : __('Do not automatically slide to next term', 'tainacan')}
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
                                            label={__('Seconds before translating to next', 'tainacan')}
                                            value={ autoPlaySpeed ? autoPlaySpeed : 3 }
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
                        </PanelBody>
                    </InspectorControls>
                </div>

                { isSelected ? 
                    (
                    <div>
                        { isModalOpen ? 
                                <TermsModal
                                    replaceTermId={ false } // The Terms modal adds `term-id-` string to terms ids. Here we dont' need it
                                    existingTaxonomyId={ taxonomyId } 
                                    selectedTermsObject={ selectedTerms } 
                                    onSelectTaxonomy={ (selectedTaxonomyId) => {
                                        taxonomyId = selectedTaxonomyId;
                                        setAttributes({ taxonomyId: taxonomyId });
                                    }}
                                    onApplySelection={ (aSelectionOfTerms) =>{
                                        selectedTerms = aSelectionOfTerms;
                                        
                                        setAttributes({
                                            selectedTerms: selectedTerms,
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

                { !terms.length && !isLoading ? (
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
                                <path d="M21.43,14.64,19.32,17a2.57,2.57,0,0,1-2,1H12.05a6,6,0,0,0-6-6H6V10.64A2.59,2.59,0,0,1,8.59,8H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,14.64ZM4,4A2,2,0,0,0,2,6v7.63a5.74,5.74,0,0,1,2-1.2V6H16V4ZM7,15.05v6.06l3.06-3.06ZM5,21.11V15.05L1.94,18.11Z"/>
                            </svg>
                            {__('List terms on a Carousel, showing their thumbnails or a preview of items.', 'tainacan')}
                        </p>
                        <Button
                            isPrimary
                            type="button"
                            onClick={ () => openCarouselModal() }>
                            {__('Select Terms', 'tainacan')}
                        </Button>   
                    </Placeholder>
                    ) : null
                }
                
                { isLoading ? 
                    <div class="spinner-container">
                        <Spinner />
                    </div> :
                    <div>
                        { isSelected && terms.length ? 
                            <div class="preview-warning">{__('Warning: this is just a demonstration. To see the carousel in action, either preview or publish your post.', 'tainacan')}</div>
                            : null
                        }
                        {  terms.length ? ( 
                            <div
                                    className={'terms-list-edit-container ' + (arrowsPosition ? 'has-arrows-' + arrowsPosition : '') + (largeArrows ? ' has-large-arrows' : '') }>
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
                                <ul className={'terms-list-edit'}>
                                    { terms }
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
            selectedTerms,
            arrowsPosition,
            largeArrows,
            maxTermsPerScreen,
            maxTermsNumber,
            autoPlay,
            autoPlaySpeed,
            loopSlides,
            hideName,
            showTermThumbnail,
            taxonomyId
        } = attributes;
        return <div 
                    className={ className }
                    selected-terms={ JSON.stringify(selectedTerms.map((term) => { return term.id; })) }
                    arrows-position={ arrowsPosition }
                    auto-play={ '' + autoPlay }
                    auto-play-speed={ autoPlaySpeed }
                    loop-slides={ '' + loopSlides }
                    hide-name={ '' + hideName }
                    large-arrows={ '' + largeArrows }
                    max-terms-number={ maxTermsNumber }
                    max-terms-per-screen={ maxTermsPerScreen }
                    taxonomy-id={ taxonomyId }
                    tainacan-api-root={ tainacan_blocks.root }
                    tainacan-base-url={ tainacan_blocks.base_url }
                    show-term-thumbnail={ '' + showTermThumbnail }
                    id={ 'wp-block-tainacan-carousel-terms-list_' + blockId }>
                        { content }
                </div>
    },
    deprecated: DeprecatedBlocks
});