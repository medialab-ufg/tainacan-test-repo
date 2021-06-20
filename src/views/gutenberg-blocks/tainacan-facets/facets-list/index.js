const { registerBlockType } = wp.blocks;

const { __ } = wp.i18n;

const { BaseControl, RangeControl, Spinner, Button, ToggleControl, Tooltip, Placeholder, PanelBody } = wp.components;

const { InspectorControls, BlockControls } = ( tainacan_blocks.wp_version < '5.2' ? wp.editor : wp.blockEditor );

import MetadataModal from './metadata-modal.js';
import ParentTermModal from './parent-term-modal.js';
import tainacan from '../../js/axios.js';
import axios from 'axios';
import qs from 'qs';
import TainacanBlocksCompatToolbar from '../../js/tainacan-blocks-compat-toolbar.js';
import DeprecatedBlocks from './facets-list-deprecated.js';

registerBlockType('tainacan/facets-list', {
    title: __('Tainacan Facets List', 'tainacan'),
    icon:
        <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
                class="tainacan-block-icon">
            <path 
                    fill="#298596"
                    d="M21.43,13.64,19.32,16a2.57,2.57,0,0,1-2,1H11a3.91,3.91,0,0,0,0-.49,5.49,5.49,0,0,0-5-5.47V9.64A2.59,2.59,0,0,1,8.59,7H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,13.64ZM4,3A2,2,0,0,0,2,5v7.3a5.32,5.32,0,0,1,2-1V5H16V3ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1,0-7,2.74,2.74,0,0,1,.5,0A3.5,3.5,0,0,1,9,16a2.92,2.92,0,0,1,0,.51,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,1,0,5.5,18,1.5,1.5,0,0,0,7,16.53Z"/>
        </svg>,
    category: 'tainacan-blocks',
    keywords: [ __( 'facets', 'tainacan' ), __( 'search', 'tainacan' ), __( 'terms', 'tainacan' ) ],
    description: __('List facets from a Tainacan Collection or Repository', 'tainacan'),
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
        collectionSlug: {
            type: String,
            default: undefined
        },
        facets: {
            type: Array,
            default: []
        },
        facetsObject: {
            type: Array,
            default: []
        },
        showImage: {
            type: Boolean,
            default: true
        },
        nameInsideImage: {
            type: Boolean,
            default: false
        },
        showItemsCount: {
            type: Boolean,
            default: true
        },
        showLoadMore: {
            type: Boolean,
            default: false
        },
        showSearchBar: {
            type: Boolean,
            value: false
        },
        layout: {
            type: String,
            default: 'grid'
        },
        cloudRate: {
            type: Number,
            default: 1
        },
        isModalOpen: {
            type: Boolean,
            default: false
        },
        gridMargin: {
            type: Number,
            default: 24
        },
        metadatumId: {
            type: String,
            default: undefined
        },
        metadatumType: {
            type: String,
            default: undefined
        },
        facetsRequestSource: {
            type: String,
            default: undefined
        },
        maxFacetsNumber: {
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
        collection: {
            type: Object,
            value: undefined
        },
        searchString: {
            type: String,
            default: undefined
        },
        blockId: {
            type: String,
            default: undefined
        },
        parentTerm: {
            type: Number,
            default: null
        },
        isParentTermModalOpen: {
            type: Boolean,
            default: false
        },
        maxColumnsCount: {
            type: Number,
            default: 5
        },
        appendChildTerms: {
            type: Boolean,
            default: false
        },
        childFacetsObject: {
            type: Object,
            default: {}
        },
        linkTermFacetsToTermPage: {
            type: Boolean,
            default: true
        },
        isLoadingChildTerms: {
            type: Number,
            default: null
        }
    },
    supports: {
        align: ['full', 'wide'],
        html: false,
        fontSize: true
    },
    edit({ attributes, setAttributes, className, isSelected, clientId }){
        let {
            facets, 
            facetsObject,
            content, 
            collectionId,
            collectionSlug,    
            showImage,
            nameInsideImage,
            showItemsCount,
            showLoadMore,
            showSearchBar,
            layout,
            cloudRate,
            isModalOpen,
            gridMargin,
            metadatumId,
            metadatumType,
            facetsRequestSource,
            maxFacetsNumber,
            searchString,
            isLoading,
            parentTerm,
            isParentTermModalOpen,
            maxColumnsCount,
            appendChildTerms,
            childFacetsObject,
            linkTermFacetsToTermPage,
            isLoadingChildTerms
        } = attributes;

        // Obtains block's client id to render it on save function
        setAttributes({ blockId: clientId });
        
        // Sets some defaults that were not working
        if (maxColumnsCount === undefined) {
            maxColumnsCount = 5;
            setAttributes({ maxColumnsCount: maxColumnsCount });
        }
        if (linkTermFacetsToTermPage === undefined) {
            linkTermFacetsToTermPage = true;
            setAttributes({ linkTermFacetsToTermPage: linkTermFacetsToTermPage });
        }
        if (showImage === undefined) {
            showImage = (layout == 'grid');
            setAttributes({ showImage: showImage });
        }
        if (nameInsideImage === undefined) {
            nameInsideImage = false;
            setAttributes({ nameInsideImage: nameInsideImage });
        }
        if (showItemsCount === undefined) {
            showItemsCount = true;
            setAttributes({ showItemsCount: showItemsCount });
        }
        if (gridMargin === undefined) {
            gridMargin = 24;
            setAttributes({ gridMargin: gridMargin });
        }
        // Uptades previous logic of metadatum type
        if (metadatumType == __('Taxonomy', 'tainacan')) {
            metadatumType = 'Tainacan\\Metadata_Types\\Taxonomy';
            setAttributes({ metadatumType: metadatumType });
        }
        if (metadatumType == __('Relationship', 'tainacan')) {
            metadatumType = 'Tainacan\\Metadata_Types\\Relationship';
            setAttributes({ metadatumType: metadatumType });
        }
        
        function prepareFacet(facet) {
            const facetId = facet.id != undefined ? facet.id : facet.value; 
            return (
                <li 
                    key={ facetId }
                    className={ 'facet-list-item' + (!showImage ? ' facet-without-image' : '') + (nameInsideImage ? ' facet-with-name-inside-image' : '') + ((appendChildTerms && facet.total_children > 0) ? ' facet-term-with-children': '')}>
                    <a 
                        id={ isNaN(facetId) ? facetId : 'facet-id-' + facetId }
                        href={ !appendChildTerms ? ((linkTermFacetsToTermPage && isMetadatumTypeTaxonomy(metadatumType)) ? facet.term_url : facet.url) : (facet.total_children > 0 ? null : (linkTermFacetsToTermPage ? facet.term_url : facet.url)) }
                        onClick={ () => { (appendChildTerms && facet.total_children > 0) ? displayChildTerms(facetId) : null } } 
                        target="_blank"
                        style={{ fontSize: layout == 'cloud' && facet.total_items ? + (1 + (cloudRate/4) * Math.log(facet.total_items)) + 'rem' : ''}}>
                        { isMetadatumTypeTaxonomy(metadatumType) ? 
                            <img
                                src={ 
                                    facet.entity && facet.entity['header_image']
                                        ?    
                                    facet.entity['header_image']
                                        : 
                                    `${tainacan_blocks.base_url}/assets/images/placeholder_square.png`
                                }
                                alt={ facet.label ? facet.label : __( 'Thumbnail', 'tainacan' ) }/>
                        : null 
                        }
                        { isMetadatumTypeRelationship(metadatumType) ? 
                            <img
                                src={ 
                                    facet.entity.thumbnail && facet.entity.thumbnail['tainacan-medium'][0] && facet.entity.thumbnail['tainacan-medium'][0] 
                                        ?
                                    facet.entity.thumbnail['tainacan-medium'][0] 
                                        :
                                    (facet.entity.thumbnail && facet.entity.thumbnail['thumbnail'][0] && facet.entity.thumbnail['thumbnail'][0]
                                        ?    
                                    facet.entity.thumbnail['thumbnail'][0] 
                                        : 
                                    `${tainacan_blocks.base_url}/assets/images/placeholder_square.png`)
                                }
                                alt={ facet.label ? facet.label : __( 'Thumbnail', 'tainacan' ) }/>
                        : null 
                        }
                        <span>{ facet.label ? facet.label : '' }</span>
                        { facet.total_items ? <span class="facet-item-count" style={{ display: !showItemsCount ? 'none' : '' }}>&nbsp;({ facet.total_items })</span> : null }
                        { appendChildTerms && facet.total_children > 0 ? 
                            ( childFacetsObject[facetId] && childFacetsObject[facetId].visible ?
                                <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="-4 -3 16 16"
                                        height="32px"
                                        width="32px">
                                    <g transform="translate(-69.294715,-148.68529)">
                                        <path d="m 71.096008,154.8776 2.43204,-2.4257 2.4257,2.4257 0.7493,-0.74294 -3.175,-3.175 -3.175,3.175 z" />
                                    </g>
                                </svg>
                            :
                            <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="-4 -3 16 16"
                                    height="32px"
                                    width="32px">
                                <g transform="translate(-69.294715,-148.68529)">
                                    <path d="m 71.096008,150.95966 2.43204,2.4257 2.4257,-2.4257 0.7493,0.74294 -3.175,3.175 -3.175,-3.175 z" />
                                </g>
                            </svg>
                            )
                        :null }
                    </a>
                    { appendChildTerms && facet.total_children > 0 ?
                        isLoadingChildTerms == facetId ? 
                        <div class="spinner-container">
                            <Spinner />
                        </div>
                        :
                        ( childFacetsObject[facetId] && childFacetsObject[facetId].visible ?
                            <ul class="child-term-facets">
                                { 
                                    childFacetsObject[facetId].facets.length ? 
                                        childFacetsObject[facetId].facets.map((aChildTermFacet) => {
                                            return prepareFacet(aChildTermFacet);
                                        })
                                        :
                                        <p class="no-child-facet-found">{ __( 'The child terms of this facet do not contain items.', 'tainacan' )}</p>
                                }
                            </ul>
                        : null )
                    : null }
                </li>
            );
        }

        function setContent(){

            facets = [];
            isLoading = true;
            
            if (facetsRequestSource != undefined && typeof facetsRequestSource == 'function')
                facetsRequestSource.cancel('Previous facets search canceled.');

            facetsRequestSource = axios.CancelToken.source();
            
            setAttributes({
                isLoading: isLoading
            });
            
            let endpoint = '/facets/' + metadatumId;
            let query = endpoint.split('?')[1];
            let queryObject = qs.parse(query);

            // Set up max facets to be shown
            if (maxFacetsNumber != undefined && maxFacetsNumber > 0)
                queryObject.number = maxFacetsNumber;
            else if (queryObject.number != undefined && queryObject.number > 0)
                setAttributes({ maxFacetsNumber: queryObject.number });
            else {
                queryObject.number = 12;
                setAttributes({ maxFacetsNumber: 12 });
            }

            // Set up searching string
            if (searchString != undefined)
                queryObject.search = searchString;
            else if (queryObject.search != undefined)
                setAttributes({ searchString: queryObject.search });
            else {
                delete queryObject.search;
                setAttributes({ searchString: undefined });
            }

            // Set up parentTerm for taxonomies
            if (parentTerm && parentTerm.id !== undefined && parentTerm.id !== null && parentTerm.id !== '' && isMetadatumTypeTaxonomy(metadatumType)) {
                queryObject.parent = parentTerm.id;
            } else {
                delete queryObject.parent;
                setAttributes({ parentTerm: null });
            }

            // Parameter to fech entity object with image and url
            queryObject['context'] = 'extended';
            
            endpoint = endpoint.split('?')[0] + '?' + qs.stringify(queryObject);
            
            tainacan.get(endpoint, { cancelToken: facetsRequestSource.token })
                .then(response => {
                    facetsObject = [];

                    if (isMetadatumTypeTaxonomy(metadatumType)) {
                        for (let facet of response.data.values) {
                            facetsObject.push(Object.assign({ 
                                term_url: facet.entity && facet.entity.url ? facet.entity.url : tainacan_blocks.site_url + '/' + collectionSlug + '/#/?taxquery[0][compare]=IN&taxquery[0][taxonomy]=' + facet.taxonomy + '&taxquery[0][terms][0]=' + facet.value,
                                url: tainacan_blocks.site_url + '/' + collectionSlug + '/#/?taxquery[0][compare]=IN&taxquery[0][taxonomy]=' + facet.taxonomy + '&taxquery[0][terms][0]=' + facet.value
                            }, facet));
                        }
                    } else {
                        for (let facet of response.data.values) {
                            facetsObject.push(Object.assign({ 
                                url: tainacan_blocks.site_url + '/' + collectionSlug + '/#/?metaquery[0][key]=' + metadatumId + '&metaquery[0][value]=' + facet.value
                            }, facet));
                        }
                    }

                    isLoading = false;

                    // Updates local storage in order to facetsObject to be used in the following functions.
                    setAttributes({
                        facetsObject: facetsObject,
                        isLoading: false,
                        facetsRequestSource: facetsRequestSource
                    });
                    
                    updateContent();
                    
                });
        }

        function displayChildTerms(parentTermId) {
            if (childFacetsObject[parentTermId]) {
                childFacetsObject[parentTermId].visible = !childFacetsObject[parentTermId].visible;
                setAttributes({
                    childFacetsObject: childFacetsObject
                });
                updateContent();
            } else
                fetchChildTerms(parentTermId)
        }

        function fetchChildTerms(parentTermId) {

            isLoadingChildTerms = parentTermId;
            
            setAttributes({
                isLoadingChildTerms: isLoadingChildTerms
            });
            updateContent();
            
            let endpoint = '/facets/' + metadatumId;
            let query = endpoint.split('?')[1];
            let queryObject = qs.parse(query);

            // Set up max facets to be shown
            if (maxFacetsNumber != undefined && maxFacetsNumber > 0)
                queryObject.number = maxFacetsNumber;
            else if (queryObject.number != undefined && queryObject.number > 0)
                setAttributes({ maxFacetsNumber: queryObject.number });
            else {
                queryObject.number = 12;
                setAttributes({ maxFacetsNumber: 12 });
            }

            // Set up searching string
            if (searchString != undefined)
                queryObject.search = searchString;
            else if (queryObject.search != undefined)
                setAttributes({ searchString: queryObject.search });
            else {
                delete queryObject.search;
                setAttributes({ searchString: undefined });
            }

            // Parameter to fech entity object with image and url
            queryObject['context'] = 'extended';

            // The term parent id
            queryObject.parent = parentTermId;
            endpoint = endpoint.split('?')[0] + '?' + qs.stringify(queryObject);
            
            tainacan.get(endpoint)
                .then(response => {
                    let childFacets = [];

                    for (let facet of response.data.values) {
                        childFacets.push(Object.assign({ 
                            term_url: facet.entity && facet.entity.url ? facet.entity.url : tainacan_blocks.site_url + '/' + collectionSlug + '/#/?taxquery[0][compare]=IN&taxquery[0][taxonomy]=' + facet.taxonomy + '&taxquery[0][terms][0]=' + facet.value,
                            url: tainacan_blocks.site_url + '/' + collectionSlug + '/#/?taxquery[0][compare]=IN&taxquery[0][taxonomy]=' + facet.taxonomy + '&taxquery[0][terms][0]=' + facet.value
                        }, facet));
                    }
                    
                    childFacetsObject[parentTermId] = {
                        facets: childFacets,
                        visible: true
                    }

                    isLoadingChildTerms = null;

                    // Updates local storage in order to childFacets to be used in the following functions.
                    setAttributes({
                        childFacetsObject: childFacetsObject,
                        isLoadingChildTerms: null,
                    });
                    updateContent();
                    
                });
        }

        function updateContent() {
            facets = [];
            for (let facetObject of facetsObject)
                facets.push(prepareFacet(facetObject));

            setAttributes({
                content: <div></div>,
                facets: facets
            });
        }

        function openMetadataModal() {
            isModalOpen = true;
            setAttributes( { 
                isModalOpen: isModalOpen
            } );
        }
        
        function openParentTermModal() {
            isParentTermModalOpen = true;
            setAttributes( { 
                isParentTermModalOpen: isParentTermModalOpen
            } );
        }

        function updateLayout(newLayout) {
            layout = newLayout;

            if (layout == 'grid' && appendChildTerms == true)
                appendChildTerms = false;
            
            if (layout == 'cloud' && showImage == true)
                showImage = false;

            setAttributes({
                showImage: showImage,
                layout: layout, 
                appendChildTerms: appendChildTerms
            });
            updateContent();
        }

        function applySearchString(event) {

            let value = event.target.value;

            if (searchString != value) {
                searchString = value;
                setAttributes({ searchString: searchString });
                setContent();
            }
        }

        // These two functions are necessary as previous versions of the block used a translated version of the type label as metadatum type.
        function isMetadatumTypeRelationship(metadatumType) {
            return (metadatumType == 'Tainacan\\Metadata_Types\\Relationship') || (metadatumType == __('Relationship', 'tainacan') );
        }
        function isMetadatumTypeTaxonomy(metadatumType) {
            return (metadatumType == 'Tainacan\\Metadata_Types\\Taxonomy') || (metadatumType == __('Taxonomy', 'tainacan') );
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
                icon: 'cloud',
                title: __( 'Cloud View', 'tainacan' ),
                onClick: () => updateLayout('cloud'),
                isActive: layout === 'cloud',
            }
        ];

        return content == 'preview' ? 
            <div className={className}>
                <img
                        width="100%"
                        src={ `${tainacan_blocks.base_url}/assets/images/facets-list.png` } />
            </div>
        : (
            <div className={className}>

                <div>
                    <BlockControls>
                        { TainacanBlocksCompatToolbar({ controls: layoutControls }) }
                        { facets.length ? (
                                TainacanBlocksCompatToolbar({
                                    label: __('Select facets', 'tainacan'),
                                    icon: <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24"
                                            height="24px"
                                            width="24px">
                                        <path d="M21.43,13.64,19.32,16a2.57,2.57,0,0,1-2,1H11a3.91,3.91,0,0,0,0-.49,5.49,5.49,0,0,0-5-5.47V9.64A2.59,2.59,0,0,1,8.59,7H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,13.64ZM4,3A2,2,0,0,0,2,5v7.3a5.32,5.32,0,0,1,2-1V5H16V3ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1,0-7,2.74,2.74,0,0,1,.5,0A3.5,3.5,0,0,1,9,16a2.92,2.92,0,0,1,0,.51,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,1,0,5.5,18,1.5,1.5,0,0,0,7,16.53Z"/>
                                    </svg>,
                                    onClick: openMetadataModal
                                })
                            ): null
                        }
                    </BlockControls>
                </div>

                <div>
                    <InspectorControls>
                        
                        <PanelBody
                                title={__('Search', 'tainacan')}
                                initialOpen={ true }
                            >
                            <ToggleControl
                                label={__('Display search bar', 'tainacan')}
                                help={ showSearchBar ? __('Toggle to show search bar on block', 'tainacan') : __('Do not show search bar', 'tainacan')}
                                checked={ showSearchBar }
                                onChange={ ( isChecked ) => {
                                        showSearchBar = isChecked;
                                        setAttributes({ showSearchBar: showSearchBar });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Display load more', 'tainacan')}
                                help={ showLoadMore ? __('Toggle to show "load more" button on block', 'tainacan') : __('Do not show "load more" button', 'tainacan')}
                                checked={ showLoadMore }
                                onChange={ ( isChecked ) => {
                                        showLoadMore = isChecked;
                                        setAttributes({ showLoadMore: showLoadMore });
                                    } 
                                }
                            />
                        </PanelBody>
                        <PanelBody
                                title={__('Facets', 'tainacan')}
                                initialOpen={ true }
                            >
                            <RangeControl
                                label={__('Maximum number of facets', 'tainacan')}
                                value={ maxFacetsNumber ? maxFacetsNumber : 12}
                                onChange={ ( aMaxFacetsNumber ) => {
                                    maxFacetsNumber = aMaxFacetsNumber;
                                    setAttributes( { maxFacetsNumber: aMaxFacetsNumber } ) 
                                    setContent();
                                }}
                                min={ 1 }
                                max={ 96 }
                            />
                            <ToggleControl
                                    label={__('Items count', 'tainacan')}
                                    help={ showItemsCount ? __("Toggle to show items counter", 'tainacan') : __("Do not show items counter", 'tainacan')}
                                    checked={ showItemsCount }
                                    onChange={ ( isChecked ) => {
                                            showItemsCount = isChecked;
                                            setAttributes({ showItemsCount: showItemsCount });
                                            updateContent();
                                        } 
                                    }
                                /> 
                        </PanelBody>
                        {/* Settings related only to facets from Taxonomy metadata */}
                        { isMetadatumTypeTaxonomy(metadatumType) ?
                            <PanelBody 
                                    title={__('Taxonomy options', 'tainacan')}
                                    initialOpen={ true }>
                                <div>
                                    <ToggleControl
                                        label={__('Link term facets to term page', 'tainacan')}
                                        help={ linkTermFacetsToTermPage ? __("Link facets to the term items page instead of the collection page filtered by term", 'tainacan') : __("Toggle to link facets to the collection page filtered by the term instead of the term items page", 'tainacan')}
                                        checked={ linkTermFacetsToTermPage }
                                        onChange={ ( isChecked ) => {
                                                linkTermFacetsToTermPage = isChecked;
                                                setAttributes({ linkTermFacetsToTermPage: linkTermFacetsToTermPage });
                                                updateContent();
                                            } 
                                        }
                                    />
                                    <BaseControl
                                        id="parent-term-selection"
                                        label={ (parentTerm && (parentTerm.id === '0' || parentTerm.id === 0)) ? __('Showing only:', 'tainacan') : __('Showing children of:', 'tainacan') }
                                        help="Narrow terms to children of a parent term."
                                    >
                                        <span style={{ fontWeight: 'bold', top: '-3px', position: 'relative' }}>&nbsp;{ parentTerm && parentTerm.name ? parentTerm.name : __('Any term.', 'tainacan') }</span>
                                        <br />
                                        <Button
                                            style={{ margin: '6px auto 16px auto', display: 'block' }}
                                            id="parent-term-selection"
                                            isPrimary
                                            onClick={ () => openParentTermModal() }>
                                            {__('Select parent term', 'tainacan')}
                                        </Button> 
                                    </BaseControl>

                                    { parentTerm !== null && layout !== 'grid' && layout !== undefined ? 
                                        <ToggleControl
                                            label={__('Append child terms', 'tainacan')}
                                            help={ appendChildTerms ? __("Do not append child terms after each term found", 'tainacan') : __("Toggle to append child terms after each term found", 'tainacan')}
                                            checked={ appendChildTerms }
                                            onChange={ ( isChecked ) => {
                                                    appendChildTerms = isChecked;
                                                    setAttributes({ appendChildTerms: appendChildTerms });
                                                    updateContent();
                                                } 
                                            }
                                        />
                                    : null}
                                </div>
                            </PanelBody>
                        : null}
                        {/* Settings related only to grid view mode */}
                        { layout == undefined || layout == 'grid' ? 
                            <PanelBody
                                    title={__('Grid view mode settings', 'tainacan')}
                                    initialOpen={ true }
                                >
                                <div>
                                    { (isMetadatumTypeTaxonomy(metadatumType) || isMetadatumTypeRelationship(metadatumType)) ? 
                                        <ToggleControl
                                            label={__('Name inside image', 'tainacan')}
                                            help={ nameInsideImage ? __("Toggle to show facet's name inside the image", 'tainacan') : __("Do not show facet's name image", 'tainacan')}
                                            checked={ nameInsideImage }
                                            onChange={ ( isChecked ) => {
                                                    nameInsideImage = isChecked;
                                                    setAttributes({ nameInsideImage: nameInsideImage });
                                                    updateContent();
                                                } 
                                            }
                                        /> : null
                                    }
                                    <div style={{ marginTop: '16px'}}>
                                        <RangeControl
                                            label={__('Margin between facets in pixels', 'tainacan')}
                                            value={ gridMargin }
                                            onChange={ ( margin ) => {
                                                gridMargin = margin;
                                                setAttributes( { gridMargin: margin } ) 
                                                updateContent();
                                            }}
                                            min={ 0 }
                                            max={ 48 }
                                        />
                                    </div>
                                    <div style={{ marginTop: '16px'}}>
                                        <RangeControl
                                                label={ __('Maximum number of columns on a wide screen', 'tainacan') }
                                                value={ maxColumnsCount ? maxColumnsCount : 5 }
                                                onChange={ ( aMaxColumnsCount ) => {
                                                    maxColumnsCount = aMaxColumnsCount;
                                                    setAttributes( { maxColumnsCount: aMaxColumnsCount } );
                                                    updateContent(); 
                                                }}
                                                min={ 1 }
                                                max={ 7 }
                                            />
                                    </div>
                                </div>
                            </PanelBody>
                        : null 
                        }
                        {/* Settings related only to list view mode */}
                        { layout == 'list' ? 
                            <PanelBody
                                    title={__('List view mode settings', 'tainacan')}
                                    initialOpen={ true }
                                >
                                <div>
                                    { (isMetadatumTypeTaxonomy(metadatumType) || isMetadatumTypeRelationship(metadatumType)) ? 
                                        <ToggleControl
                                            label={__('Image', 'tainacan')}
                                            help={ showImage ? __("Toggle to show facet's image", 'tainacan') : __("Do not show facet's image", 'tainacan')}
                                            checked={ showImage }
                                            onChange={ ( isChecked ) => {
                                                    showImage = isChecked;
                                                    setAttributes({ showImage: showImage });
                                                    updateContent();
                                                } 
                                            }
                                        /> 
                                    : null }
                                    <div style={{ marginTop: '16px'}}>
                                        <RangeControl
                                                label={ __('Maximum number of columns on a wide screen', 'tainacan') }
                                                value={ maxColumnsCount ? maxColumnsCount : 5 }
                                                onChange={ ( aMaxColumnsCount ) => {
                                                    maxColumnsCount = aMaxColumnsCount;
                                                    setAttributes( { maxColumnsCount: aMaxColumnsCount } );
                                                    updateContent(); 
                                                }}
                                                min={ 1 }
                                                max={ 7 }
                                            />
                                    </div>
                                </div>
                            </PanelBody>
                        : null 
                        }
                        {/* Settings related only to cloud view mode */}
                        { layout == 'cloud' ? 
                            <PanelBody
                                    title={__('Cloud settings', 'tainacan')}
                                    initialOpen={ true }
                                >
                                <div>
                                    <RangeControl
                                            label={__('Growth rate for facets according to items count.', 'tainacan')}
                                            value={ cloudRate }
                                            onChange={ ( rate ) => {
                                                cloudRate = rate;
                                                setAttributes( { cloudRate: rate } ) 
                                                updateContent();
                                            }}
                                            min={ 0 }
                                            max={ 10 }
                                        />
                                </div>
                            </PanelBody>
                        : null 
                        }
                    </InspectorControls>
                </div>

                { isSelected ? 
                    (
                    <div>
                        { isModalOpen ? 
                            <MetadataModal
                                existingCollectionId={ collectionId } 
                                existingCollectionSlug={ collectionSlug } 
                                existingMetadatumId={ metadatumId } 
                                existingMetadatumType={ metadatumType } 
                                onSelectCollection={ (selectedCollection) => {
                                    collectionId = selectedCollection.id;
                                    collectionSlug = selectedCollection.slug;

                                    setAttributes({ 
                                        collectionSlug: collectionSlug,
                                        collectionId: collectionId 
                                    });
                                }}
                                onSelectMetadatum={ (selectedFacet) =>{
                                    metadatumId = selectedFacet.metadatumId;
                                    metadatumType = selectedFacet.metadatumType;
                                    setAttributes({
                                        metadatumId: metadatumId,
                                        metadatumType: metadatumType,
                                        isModalOpen: false,
                                        parentTerm: null
                                    });
                                    setContent();
                                }}
                                onCancelSelection={ () => setAttributes({ isModalOpen: false }) }/> 
                            : null
                        }

                        { isParentTermModalOpen ? 
                            <ParentTermModal
                                existingFacetId={ parentTerm && parentTerm.id ? parentTerm.id : null } 
                                collectionId={ collectionId } 
                                metadatumId={ metadatumId } 
                                onSelectFacet={ (selectedFacet) => {
                                    parentTerm = selectedFacet.id !== null && selectedFacet.id !== '' && selectedFacet.id !== undefined ? selectedFacet : null
                                    setAttributes({ 
                                        parentTerm: parentTerm,
                                        isParentTermModalOpen: false
                                    });
                                    setContent();
                                }}
                                onCancelSelection={ () => setAttributes({ isParentTermModalOpen: false }) }/> 
                            : null
                        }
                    </div>
                    ) : null
                }

                {
                    showSearchBar ?
                    <div class="facets-search-bar">
                        <Button
                            onClick={ () => {  setContent(); }}
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
                    </div>
                : null
                }

                { !facets.length && !isLoading && !(searchString != undefined && searchString != '') ? (
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
                                <path d="M21.43,13.64,19.32,16a2.57,2.57,0,0,1-2,1H11a3.91,3.91,0,0,0,0-.49,5.49,5.49,0,0,0-5-5.47V9.64A2.59,2.59,0,0,1,8.59,7H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,13.64ZM4,3A2,2,0,0,0,2,5v7.3a5.32,5.32,0,0,1,2-1V5H16V3ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1,0-7,2.74,2.74,0,0,1,.5,0A3.5,3.5,0,0,1,9,16a2.92,2.92,0,0,1,0,.51,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,1,0,5.5,18,1.5,1.5,0,0,0,7,16.53Z"/>
                            </svg>
                            {__('List facets from a Tainacan Collection or Repository', 'tainacan')}
                        </p>
                        {
                            parentTerm && parentTerm.id && isMetadatumTypeTaxonomy(metadatumType)? 
                                <div style={{ display: 'flex' }}>
                                    <Button
                                        isPrimary
                                        type="button"
                                        onClick={ () => openParentTermModal() }>
                                        {__('Change parent term', 'tainacan')}
                                    </Button>
                                    <p style={{ margin: '0 12px' }}>{__('or', 'tainacan')}</p>
                                    <Button
                                        isPrimary
                                        type="button"
                                        onClick={ () => openMetadataModal() }>
                                        {__('Change facets source', 'tainacan')}
                                    </Button>
                                </div>
                            : 
                            <Button
                                isPrimary
                                type="button"
                                onClick={ () => openMetadataModal() }>
                                {__('Select facets', 'tainacan')}
                            </Button>
                        }
                           
                    </Placeholder>
                    ) : null
                }
                
                { isLoading ? 
                    <div class="spinner-container">
                        <Spinner />
                    </div> :
                    <div>
                        { layout !== 'list' ?
                            <ul 
                                style={{ 
                                    gridGap: layout == 'grid' ? (gridMargin + 'px') : 'inherit',
                                    marginTop: showSearchBar ? '1.5rem' : '0px'
                                }}
                                className={ 'facets-list-edit facets-layout-' + layout + (maxColumnsCount ? ' max-columns-count-' + maxColumnsCount : '') }>
                                { facets }
                            </ul>
                            :
                            <ul 
                                style={{  
                                    marginTop: showSearchBar ? '1.5rem' : '0px'
                                }}
                                className={ 'facets-list-edit facets-layout-' + layout + (maxColumnsCount ? ' max-columns-count-' + maxColumnsCount : '') }>
                                {
                                    Array.from(Array(maxColumnsCount).keys()).map( (column) => {
                                        return <div>
                                            {
                                                facets.slice(column  * Math.ceil(facets.length/maxColumnsCount), (column + 1) * Math.ceil(facets.length/maxColumnsCount))
                                            }
                                        </div>
                                    })
                                }
                            </ul>
                        }
                    </div>
                }

                { showLoadMore && facets.length > 0 && !isLoading ?
                    <Tooltip text={__('If necessary, the show more button will be available on post or page.', 'tainacan')}>
                        <button
                                class="show-more-button"
                                disabled
                                label={__('Show more', 'tainacan')}>
                            <span class="icon">
                                <i>
                                    <svg
                                            width="24"
                                            height="24"
                                            viewBox="4 5 24 24">
                                        <path d="M 7.41,8.295 6,9.705 l 6,6 6,-6 -1.41,-1.41 -4.59,4.58 z"/>
                                        <path
                                                d="M0 0h24v24H0z"
                                                fill="none"/>                        
                                    </svg>
                                </i>
                            </span>
                        </button>
                    </Tooltip> 
                : null
                }
            </div>
        );
    },
    save({ attributes, className }){
        const {
            content, 
            blockId,
            collectionId,  
            collectionSlug,
            parentTerm,  
            showImage,
            nameInsideImage,
            showItemsCount,
            showLoadMore,
            layout,
            cloudRate,
            gridMargin,
            metadatumId,
            metadatumType,
            maxFacetsNumber,
            maxColumnsCount,
            showSearchBar,
            linkTermFacetsToTermPage,
            appendChildTerms
        } = attributes;
        return <div 
                    className={ className }
                    metadatum-id={ metadatumId }
                    metadatum-type={ metadatumType }
                    collection-id={ collectionId }  
                    collection-slug={ collectionSlug }
                    parent-term-id={ parentTerm ? parentTerm.id : undefined }  
                    show-image={ '' + showImage }
                    name-inside-image={ nameInsideImage === true ? 'true' : 'false' }
                    show-items-count={ '' + showItemsCount }
                    show-search-bar={ '' + showSearchBar }
                    show-load-more={ '' + showLoadMore }
                    append-child-terms={ (appendChildTerms === true ? 'true' : 'false') }
                    link-term-facets-to-term-page={ linkTermFacetsToTermPage === false ? 'false' : 'true' }
                    layout={ layout }
                    cloud-rate={ cloudRate }
                    grid-margin={ gridMargin }
                    max-facets-number={ maxFacetsNumber }
                    max-columns-count={ maxColumnsCount }
                    tainacan-api-root={ tainacan_blocks.root }
                    tainacan-base-url={ tainacan_blocks.base_url }
                    tainacan-site-url={ tainacan_blocks.site_url }
                    id={ 'wp-block-tainacan-facets-list_' + blockId }>
                        { content }
                </div>
    },
    deprecated: DeprecatedBlocks
});