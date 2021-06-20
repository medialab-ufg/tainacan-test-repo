const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

const { 
    Button,
    ColorPicker,
    BaseControl,
    CheckboxControl,
    RangeControl,
    FontSizePicker,
    HorizontalRule,
    SelectControl,
    ToggleControl,
    Placeholder,
    PanelBody,
    ToolbarGroup,
    Dropdown,
    ToolbarButton,
    ToolbarItem,
    DropdownMenu,
    MenuGroup,
    MenuItemsChoice
} = wp.components;

const { InspectorControls, BlockControls } = ( tainacan_blocks.wp_version < '5.2' ? wp.editor : wp.blockEditor );

import CollectionModal from './collection-modal.js';
import TermModal from './term-modal.js';

registerBlockType('tainacan/faceted-search', {
    title: __('Tainacan Faceted Search', 'tainacan'),
    icon:
        <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 6.3499998 6.3499998"
                height="24px"
                width="24px"
                class="tainacan-block-icon">
            <g transform="matrix(0.2891908,0,0,0.2891908,-30.465367,-38.43427)">
                <path 
                        transform="matrix(0.26458333,0,0,0.26458333,104.32258,131.88168)"
                        fill="#298596"
                        d="M 16.662109,14.712891 V 24.927734 H 84.753906 V 14.712891 Z m 6.810547,17.021484 v 9.748047 c 6.857764,2.272819 11.798639,8.605281 11.798828,16.078125 -7.56e-4,2.313298 -0.496344,4.586348 -1.421875,6.693359 l 8.375,8.375 -3.365234,3.367188 H 77.945312 V 31.734375 Z m 17.019532,10.216797 h 20.429687 v 10.21289 H 40.492188 Z m -22.835938,3.84375 a 9.1779065,9.1779065 0 0 0 -0.916016,0.03906 11.753475,11.753475 0 0 0 1.671875,23.445313 11.455635,11.455635 0 0 0 6.466797,-1.910156 l 1.908203,1.910156 2.88086,2.982422 3.820312,3.716797 3.347657,-3.347657 -3.851563,-3.855468 -2.847656,-2.845703 -1.941407,-1.941407 a 11.455635,11.455635 0 0 0 1.941407,-6.433593 11.723603,11.723603 0 0 0 -6.697266,-10.583985 11.422139,11.422139 0 0 0 -5.027344,-1.136719 9.1779065,9.1779065 0 0 0 -0.755859,-0.03906 z m 0.755859,6.736328 a 5.0244015,5.0244015 0 0 1 5.027344,5.025391 v 0.101562 a 5.0244015,5.0244015 0 0 1 -0.269531,1.570313 4.9574094,4.9574094 0 0 1 -4.757813,3.351562 5.0244015,5.0244015 0 0 1 -1.671875,-9.746094 4.6559456,4.6559456 0 0 1 1.671875,-0.302734 z m 6.376953,20.601562 c -0.431168,0.183308 -0.872311,0.335613 -1.316406,0.484376 v 2.378906 h 4.179688 z "/>
            </g>
        </svg>,
    category: 'tainacan-blocks',
    keywords: [ __( 'facets', 'tainacan' ), __( 'search', 'tainacan' ), __( 'items', 'tainacan' ) ],
    description: __('A full items list faceted search from either the repository, a collection or a term.', 'tainacan'),
    example: {
        attributes: {
            listType: 'preview'
        }
    },
    attributes: {
        termId: {
            type: String,
            default: undefined
        },
        taxonomyId: {
            type: String,
            default: undefined
        },
        collectionId: {
            type: String,
            default: undefined
        },
        defaultViewMode: {
            type: String,
            default: 'masonry'
        },
        enabledViewModes: {
            type: Array,
            default: Object.keys(tainacan_plugin.registered_view_modes)
        },
        collectionDefaultViewMode: {
            type: String,
            default: 'masonry'
        },
        collectionEnabledViewModes: {
            type: Array,
            default: []
        },
        hideFilters: {
            type: Boolean,
            default: false
        },
        hideHideFiltersButton: {
            type: Boolean,
            default: false
        },
        hideSearch: {
            type: Boolean,
            default: false
        },
        hideAdvancedSearch: {
            type: Boolean,
            default: false
        },
        hideDisplayedMetadataButton: {
            type: Boolean,
            default: false
        },
        hideSortingArea: {
            type: Boolean,
            default: false
        },
        hideSortByButton: {
            type: Boolean,
            default: false
        },
        hideItemsThumbnail: {
            type: Boolean,
            default: false
        },
        hideExposersButton: {
            type: Boolean,
            default: false
        },
        hideItemsPerPageButton: {
            type: Boolean,
            default: false
        },
        defaultItemsPerPage: {
            type: Number,
            default: 12
        },
        hideGoToPageButton: {
            type: Boolean,
            default: false
        },
        hidePaginationArea: {
            type: Boolean,
            default: false
        },
        showFiltersButtonInsideSearchControl: {
            type: Boolean,
            default: false
        },
        startWithFiltersHidden: {
            type: Boolean,
            default: false
        },
        filtersAsModal: {
            type: Boolean,
            default: false
        },
        showInlineViewModeOptions: {
            type: Boolean,
            default: false
        },
        showFullscreenWithViewModes: {
            type: Boolean,
            default: false
        },
        listType: {
            type: String,
            default: ''
        },
        isCollectionModalOpen: {
            type: Boolean,
            default: false
        },
        isTermModalOpen: {
            type: Boolean,
            default: false
        },
        backgroundColor: {
            type: String,
            default: '#ffffff'
        },
        baseFontSize: {
            type: Number,
            default: 16
        },
        filtersAreaWidth: {
            type: Number,
            default: 20
        },
        inputColor: {
            type: String,
            default: '#1d1d1d'
        },
        inputBackgroundColor: {
            type: String,
            default: '#ffffff'
        },
        inputBorderColor: {
            type: String,
            default: '#dbdbdb'
        },
        labelColor: {
            type: String,
            default: '#454647'
        },
        infoColor: {
            type: String,
            default: '#555758'
        },
        headingColor: {
            type: String,
            default: '#000000'
        },
        skeletonColor: {
            type: String,
            default: '#eeeeee'
        },
        itemBackgroundColor: {
            type: String,
            default: '#ffffff'
        },
        itemHoverBackgroundColor: {
            type: String,
            default: '#f2f2f2'
        },
        itemHeadingHoverBackgroundColor: {
            type: String,
            default: '#dbdbdb'
        },
        primaryColor: {
            type: String,
            default: '#d9eced'
        },
        secondaryColor: {
            type: String,
            default: '#298596'
        }
    },
    supports: {
        align: ['full', 'wide'],
        html: true,
        multiple: false
    },
    edit({ attributes, setAttributes, className, isSelected, clientId }){
        let {
            termId,
            taxonomyId,
            collectionId,
            defaultViewMode,
            enabledViewModes,
            collectionDefaultViewMode,
            collectionEnabledViewModes,
            hideFilters,
            hideHideFiltersButton,
            hideSearch,
            hideAdvancedSearch,
            hideDisplayedMetadataButton,
            hideSortingArea,
            hideSortByButton,
            hideItemsThumbnail,
            hideExposersButton,
            hideItemsPerPageButton,
            hidePaginationArea,
            defaultItemsPerPage,
            hideGoToPageButton,
            showFiltersButtonInsideSearchControl,
            startWithFiltersHidden,
            filtersAsModal,
            showInlineViewModeOptions,
            showFullscreenWithViewModes,
            listType,
            isTermModalOpen,
            isCollectionModalOpen,
            backgroundColor,
            baseFontSize,
            filtersAreaWidth,
            inputColor,
            inputBackgroundColor,
            inputBorderColor,
            labelColor,
            infoColor,
            headingColor,
            skeletonColor,
            itemBackgroundColor,
            itemHoverBackgroundColor,
            itemHeadingHoverBackgroundColor,
            primaryColor,
            secondaryColor
        } = attributes;

        let registeredViewModesEntries = [];
        let registeredViewModesKeys = [];
        updateAvailableViewModes(hideItemsThumbnail);

        const fontSizes = [
            {
                name: __( 'Tiny', 'tainacan' ),
                slug: 'tiny',
                size: 12,
            },
            {
                name: __( 'Small', 'tainacan' ),
                slug: 'small',
                size: 14,
            },
            {
                name: __( 'Normal', 'tainacan' ),
                slug: 'normal',
                size: 16,
            },
            {
                name: __( 'Big', 'tainacan' ),
                slug: 'big',
                size: 18,
            },
            {
                name: __( 'Huge', 'tainacan' ),
                slug: 'huge',
                size: 20,
            },
        ];

        const listTypeChoices = [
            {
                value: 'collection',
                label: __('a Collection', 'tainacan'),
            },
            {
                value: 'term',
                label: __('a Taxonomy Term', 'tainacan'),
            },
            {
                value: 'repository',
                label: __('the Repository', 'tainacan'),
            },
        ];

        function openCollectionModal() {
            isCollectionModalOpen = true;
            setAttributes( { 
                isCollectionModalOpen: isCollectionModalOpen
            } );
        }

        function openTermModal() {
            isTermModalOpen = true;
            setAttributes( { 
                isTermModalOpen: isTermModalOpen
            } );
        }

        function checkIfViewModeIsEnabled(viewMode) {
            return enabledViewModes.includes(viewMode);
        }

        function updateAvailableViewModes(isItemThumbnailHidden) {
            if (isItemThumbnailHidden != true) {
                registeredViewModesEntries = Object.entries(tainacan_plugin.registered_view_modes);
                registeredViewModesKeys = Object.keys(tainacan_plugin.registered_view_modes);
            } else {
                const validViewModes = {};
                Object.keys(tainacan_plugin.registered_view_modes).forEach((viewModeKey) => {
                    if (!tainacan_plugin.registered_view_modes[viewModeKey]['requires_thumbnail']) 
                        validViewModes[viewModeKey] = tainacan_plugin.registered_view_modes[viewModeKey];
                });
                registeredViewModesEntries = Object.entries(validViewModes);
                registeredViewModesKeys = Object.keys(validViewModes);

                const availableViewModes = JSON.parse(JSON.stringify(enabledViewModes)).filter((aViewMode) => registeredViewModesKeys.includes(aViewMode) );
                if (JSON.stringify(availableViewModes) != JSON.stringify(enabledViewModes)) {
                    enabledViewModes = availableViewModes;

                    // Puts a valid view mode as default if the current one is not in the list anymore.
                    if (!checkIfViewModeIsEnabled(defaultViewMode)) {
                        const validViewModeIndex = enabledViewModes.findIndex((aViewMode) => registeredViewModesKeys.includes(aViewMode));
                        if (validViewModeIndex >= 0)
                            defaultViewMode = enabledViewModes[validViewModeIndex];
                    }

                    setAttributes({
                        enabledViewModes: enabledViewModes,
                        defaultViewMode: defaultViewMode 
                    });
                }
            }
        }

        function onUpdateListType( aListType, props) {
            listType = aListType;

            if (listType != 'collection') {
                enabledViewModes = registeredViewModesKeys;
                defaultViewMode = hideItemsThumbnail ? 'table' : 'masonry';
            }

            setAttributes({
                listType: aListType,
                enabledViewModes: enabledViewModes,
                defaultViewMode: defaultViewMode
            });

            if (listType == 'term')
                openTermModal();
            else if (listType == 'collection')
                openCollectionModal();
            else
                return;
        }

        return ( listType == 'preview' ? 
                <div className={className}>
                    <img
                            width="100%"
                            src={ `${tainacan_blocks.base_url}/assets/images/faceted-search.png` } />
                </div>
            : (
            <div className={className}>

                <div>
                    <BlockControls>
                        { !( termId == undefined && listType == 'term' ) && !( collectionId == undefined && listType == 'collection' ) ?
                            tainacan_blocks.wp_version < '5.4' ?
                                <Dropdown
                                    contentClassName="wp-block-tainacan__dropdown"
                                    renderToggle={ ( { isOpen, onToggle } ) => 
                                        <Button
                                            style={{ whiteSpace: 'nowrap', backgroundColor: '#fff', alignItems: 'center', borderTop: '1px solid #b5bcc2', borderBottom: '1px solid #b5bcc2', height: '100%' }}
                                            onClick={ onToggle }
                                            aria-expanded={ isOpen }>
                                                { __('Items list source', 'tainacan')  }
                                                <span class="components-dropdown-menu__indicator"></span> 
                                        </Button>
                                    }
                                    renderContent={ ( { onToggle } ) => (
                                        <MenuGroup>
                                            <MenuItemsChoice
                                                choices={ listTypeChoices }
                                                value={ listType }
                                                onSelect={ (value) => {
                                                    onUpdateListType(value);
                                                    onToggle(); 
                                                }}>
                                            </MenuItemsChoice>
                                        </MenuGroup>
                                    ) }
                                />
                                :
                                <ToolbarGroup>
                                    { tainacan_blocks.wp_version < '5.6' ?
                                        <Dropdown
                                            contentClassName="wp-block-tainacan__dropdown"
                                            renderToggle={ ( { isOpen, onToggle } ) => (
                                                tainacan_blocks.wp_version < '5.5' ?
                                                    <Button
                                                        style={{ whiteSpace: 'nowrap' }}
                                                        onClick={ onToggle }
                                                        aria-expanded={ isOpen }>
                                                            { __('Items list source', 'tainacan')  }
                                                            <span class="components-dropdown-menu__indicator"></span> 
                                                    </Button>
                                                    :
                                                    <ToolbarButton
                                                        onClick={ onToggle }
                                                        aria-expanded={ isOpen }>
                                                            { __('Items list source', 'tainacan')  }
                                                            <span class="components-dropdown-menu__indicator"></span>  
                                                    </ToolbarButton>
                                            ) }
                                            renderContent={ ( { onToggle } ) => (
                                                <MenuGroup>
                                                    <MenuItemsChoice
                                                        choices={ listTypeChoices }
                                                        value={ listType } 
                                                        onSelect={ (value) => {
                                                            onUpdateListType(value);
                                                            onToggle(); 
                                                        }}>
                                                    </MenuItemsChoice>
                                                </MenuGroup>
                                            ) }
                                        />
                                        :
                                        <ToolbarItem>
                                            { () => (
                                                <Dropdown
                                                    contentClassName="wp-block-tainacan__dropdown"
                                                    renderToggle={ ( { isOpen, onToggle } ) => (
                                                            <ToolbarButton
                                                                onClick={ onToggle }
                                                                aria-expanded={ isOpen }>
                                                                    { __('Items list source', 'tainacan')  }
                                                                    <span class="components-dropdown-menu__indicator"></span>  
                                                            </ToolbarButton>
                                                    ) }
                                                    renderContent={ ( { onToggle } ) => (
                                                        <MenuGroup>
                                                            <MenuItemsChoice
                                                                choices={ listTypeChoices }
                                                                value={ listType } 
                                                                onSelect={ (value) => {
                                                                    onUpdateListType(value);
                                                                    onToggle(); 
                                                                }}>
                                                            </MenuItemsChoice>
                                                        </MenuGroup>
                                                    ) }
                                                />
                                            ) }
                                        </ToolbarItem>
                                }
                                </ToolbarGroup>
                        :null }
                    </BlockControls>
                </div>

                <div>
                    <InspectorControls>
                        
                        <PanelBody
                            title={__('Search Control Area', 'tainacan')}
                            initialOpen={ true }
                            >
                            <ToggleControl
                                label={__('Hide search input', 'tainacan')}
                                help={ hideSearch ? __('Do not show textual search input', 'tainacan') : __('Toggle to show textual search input', 'tainacan')}
                                checked={ hideSearch }
                                onChange={ ( isChecked ) => {
                                        hideSearch = isChecked;
                                        setAttributes({ hideSearch: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Hide advanced search', 'tainacan')}
                                help={ hideAdvancedSearch || hideSearch ? __('Do not show advanced search', 'tainacan') : __('Toggle to show advanced search', 'tainacan')}
                                checked={ hideAdvancedSearch || hideSearch }
                                onChange={ ( isChecked ) => {
                                        hideAdvancedSearch = isChecked;
                                        setAttributes({ hideAdvancedSearch: isChecked });
                                    }  
                                }
                            />
                            <ToggleControl
                                label={__('Hide "Displayed metadata" button', 'tainacan')}
                                help={ hideDisplayedMetadataButton ? __('Do not show "Displayed metadata" dropdown even if the view mode allows it', 'tainacan') : __('Toggle to show "Displayed metadata" dropdown if the view mode allows it', 'tainacan')}
                                checked={ hideDisplayedMetadataButton }
                                onChange={ ( isChecked ) => {
                                        hideDisplayedMetadataButton = isChecked;
                                        setAttributes({ hideDisplayedMetadataButton: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Hide sorting area', 'tainacan')}
                                help={ hideSortingArea ? __('Do not show search sorting options', 'tainacan') : __('Toggle to show search sorting options', 'tainacan')}
                                checked={ hideSortingArea }
                                onChange={ ( isChecked ) => {
                                        hideSortingArea = isChecked;
                                        setAttributes({ hideSortingArea: isChecked });
                                    }  
                                }
                            />
                            <ToggleControl
                                label={__('Hide "Sort By" button', 'tainacan')}
                                help={ hideSortingArea || hideSortByButton ? __('Do not show "Sort By" button', 'tainacan') : __('Toggle to show "Sort By" button', 'tainacan')}
                                checked={ hideSortingArea || hideSortByButton }
                                onChange={ ( isChecked ) => {
                                        hideSortByButton = isChecked;
                                        setAttributes({ hideSortByButton: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Show inline View Mode options', 'tainacan')}
                                help={ showInlineViewModeOptions ? __('Toggle to show View Mode options inline instead of a dropdown', 'tainacan') : __('Keep view mode options as a dropdown', 'tainacan')}
                                checked={ showInlineViewModeOptions }
                                onChange={ ( isChecked ) => {
                                        showInlineViewModeOptions = isChecked;
                                        setAttributes({ showInlineViewModeOptions: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Show fullscreen Slides with other View Modes', 'tainacan')}
                                help={ showFullscreenWithViewModes ? __('Toggle to show fullscreen Slides view mode alongside with other View Modes', 'tainacan') : __('Keep fullscreen Slides view mode separated from other View Mode Options', 'tainacan')}
                                checked={ showFullscreenWithViewModes }
                                onChange={ ( isChecked ) => {
                                        showFullscreenWithViewModes = isChecked;
                                        setAttributes({ showFullscreenWithViewModes: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Hide "View as..." button', 'tainacan')}
                                help={ hideExposersButton ? __('Do not show "View as...", the "Exposers" button', 'tainacan') : __('Toggle to show "View as...", the "Exposers" button', 'tainacan')}
                                checked={ hideExposersButton }
                                onChange={ ( isChecked ) => {
                                        hideExposersButton = isChecked;
                                        setAttributes({ hideExposersButton: isChecked });
                                    } 
                                }
                            />
                             <ToggleControl
                                label={__('Show "Filters" button inside the Search Control', 'tainacan')}
                                help={ showFiltersButtonInsideSearchControl ? __('Toggle to show Filters button inside the Search Control, instead of floating left', 'tainacan') : __('Keep Filters button as a floating arrow on the left', 'tainacan')}
                                checked={ showFiltersButtonInsideSearchControl }
                                onChange={ ( isChecked ) => {
                                        showFiltersButtonInsideSearchControl = isChecked;
                                        setAttributes({ showFiltersButtonInsideSearchControl: isChecked });
                                    } 
                                }
                            />

                            <ToggleControl
                                label={__('Hide Items Thumbnail', 'tainacan')}
                                help={ hideItemsThumbnail ? __('Do not show the items Thumbnail on the list', 'tainacan') : __('Toggle to show the items thumbnail on the list', 'tainacan')}
                                checked={ hideItemsThumbnail }
                                onChange={ ( isChecked ) => {
                                        hideItemsThumbnail = isChecked;
                                        setAttributes({ hideItemsThumbnail: isChecked });
                                        updateAvailableViewModes(isChecked);
                                    } 
                                }
                            />

                            <BaseControl
                                    id="defaultViewModeSelect"
                                    label={ __('Forced default view mode', 'tainacan')}
                                    help={ __('The default view mode to be forced against the one setted on the repository', 'tainacan') }>
                                <SelectControl
                                        label={ __('Default view mode', 'tainacan') }
                                        hideLabelFromVision
                                        value={ defaultViewMode }
                                        options={
                                            [{ value: 'none', label: __('Use current view mode settings', 'tainacan') }]
                                            .concat(registeredViewModesEntries
                                                .map(aViewMode => { return { label: aViewMode[1].label, value: aViewMode[0], disabled: !checkIfViewModeIsEnabled(aViewMode[0]) || aViewMode[1].full_screen }})
                                            )
                                        }
                                        onChange={ (aViewMode) => {
                                            defaultViewMode = aViewMode;
                                            setAttributes({ defaultViewMode: aViewMode });
                                        } }
                                    />
                            </BaseControl>
                            
                            <BaseControl
                                    id="enabledViewModeCheckboxesList"
                                    label={ __('Forced enabled view modes', 'tainacan') }
                                    help={ __('Select the view modes that you wish to be available for user selection on the items list.', 'tainacan') }>
                                
                                { 
                                    registeredViewModesEntries.map(aRegisteredViewMode => {
                                        return  (
                                        <CheckboxControl
                                                label={ aRegisteredViewMode[1].label }
                                                checked={ checkIfViewModeIsEnabled(aRegisteredViewMode[0]) }
                                                disabled={ checkIfViewModeIsEnabled(aRegisteredViewMode[0]) && enabledViewModes.filter((aViewMode) => tainacan_plugin.registered_view_modes[aViewMode] && !tainacan_plugin.registered_view_modes[aViewMode].full_screen).length <= 1 }
                                                onChange={ () => {
                                                    let index = enabledViewModes.findIndex(aViewMode => aViewMode == aRegisteredViewMode[0]);
                                                    if (index > -1)
                                                        enabledViewModes.splice(index, 1);
                                                    else    
                                                        enabledViewModes.push(aRegisteredViewMode[0]);
                                                    
                                                     // Puts a valid view mode as default if the current one is not in the list anymore.
                                                    if (defaultViewMode != 'none' && !enabledViewModes.includes(defaultViewMode)) {
                                                        const validViewModeIndex = enabledViewModes.findIndex((aViewMode) => (tainacan_plugin.registered_view_modes[aViewMode] && !tainacan_plugin.registered_view_modes[aViewMode].full_screen));
                                                        if (validViewModeIndex >= 0)
                                                            defaultViewMode = enabledViewModes[validViewModeIndex];
                                                    }

                                                    setAttributes({ 
                                                        enabledViewModes: JSON.parse(JSON.stringify(enabledViewModes)),
                                                        defaultViewMode: defaultViewMode 
                                                    });
                                                } }
                                            /> 
                                        )
                                    })
                                }
                            </BaseControl>
                            
                        </PanelBody>

                        <PanelBody
                                title={__('Filters Area', 'tainacan')}
                                initialOpen={ true }
                            >
                            <ToggleControl
                                label={__('Hide Filters', 'tainacan')}
                                help={ hideFilters ? __('Do not show Filters with the list', 'tainacan') : __('Toggle to show Filters with the list', 'tainacan')}
                                checked={ hideFilters }
                                onChange={ ( isChecked ) => {
                                        hideFilters = isChecked;
                                        setAttributes({ hideFilters: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Hide "Hide Filters" button', 'tainacan')}
                                help={ hideHideFiltersButton || hideFilters ? __('Do not show "Hide Filters" button', 'tainacan') : __('Toggle to show "Hide Filters" button', 'tainacan')}
                                checked={ hideHideFiltersButton || hideFilters }
                                onChange={ ( isChecked ) => {
                                        hideHideFiltersButton = isChecked;
                                        setAttributes({ hideHideFiltersButton: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Start with Filters hidden', 'tainacan')}
                                help={ startWithFiltersHidden ? __('Render the list with filters hidden at first', 'tainacan') : __('Toggle to render the list with filters visible at first', 'tainacan')}
                                checked={ startWithFiltersHidden }
                                onChange={ ( isChecked ) => {
                                        startWithFiltersHidden = isChecked;
                                        setAttributes({ startWithFiltersHidden: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Filters as a Modal', 'tainacan')}
                                help={ filtersAsModal ? __('Render the filters area as modal instead of a side panel', 'tainacan') : __('Toggle to show filters list as a side panel instead of a modal', 'tainacan')}
                                checked={ filtersAsModal }
                                onChange={ ( isChecked ) => {
                                        filtersAsModal = isChecked;
                                        setAttributes({ filtersAsModal: isChecked });
                                    } 
                                }
                            />
                        </PanelBody>

                        <PanelBody
                                title={__('Pagination Area', 'tainacan')}
                                initialOpen={ true }
                            >
                            <ToggleControl
                                label={__('Hide pagination area', 'tainacan')}
                                help={ hidePaginationArea ? __('Do not show search pagination options', 'tainacan') : __('Toggle to show search pagination options', 'tainacan')}
                                checked={ hidePaginationArea }
                                onChange={ ( isChecked ) => {
                                        hidePaginationArea= isChecked;
                                        setAttributes({ hidePaginationArea: isChecked });
                                    }  
                                }
                            />
                            <ToggleControl
                                label={__('Hide "Items per Page" button', 'tainacan')}
                                help={ hidePaginationArea || hideItemsPerPageButton ? __('Do not show "Items per Page" button', 'tainacan') : __('Toggle to show "Items per Page" button', 'tainacan')}
                                checked={ hidePaginationArea || hideItemsPerPageButton }
                                onChange={ ( isChecked ) => {
                                        hideItemsPerPageButton = isChecked;
                                        setAttributes({ hideItemsPerPageButton: isChecked });
                                    } 
                                }
                            />
                            <ToggleControl
                                label={__('Hide "Go to Page" button', 'tainacan')}
                                help={ hidePaginationArea || hideGoToPageButton ? __('Do not show "Go to Page" button', 'tainacan') : __('Toggle to show "Go to Page" button', 'tainacan')}
                                checked={ hidePaginationArea || hideGoToPageButton }
                                onChange={ ( isChecked ) => {
                                        hideGoToPageButton = isChecked;
                                        setAttributes({ hideGoToPageButton: isChecked });
                                    } 
                                }
                            />
                             <RangeControl
                                label={__('Default number of items per page', 'tainacan')}
                                value={ defaultItemsPerPage ? defaultItemsPerPage : 12 }
                                onChange={ ( itemsPerPage ) => {
                                    defaultItemsPerPage = itemsPerPage;
                                    setAttributes( { defaultItemsPerPage: itemsPerPage } );
                                }}
                                min={ 1 }
                                max={ tainacan_plugin.api_max_items_per_page ? tainacan_plugin.api_max_items_per_page : 96 }
                            />
                        </PanelBody>

                        <PanelBody
                                title={__('Colors and Sizes', 'tainacan')}
                                initialOpen={ false }
                            >
                            <FontSizePicker
                                fontSizes={ fontSizes }
                                value={ baseFontSize }
                                fallbackFontSize={ 16 }
                                onChange={ ( newFontSize ) => {
                                    setAttributes( { baseFontSize: newFontSize } );
                                } }
                            />
                            <RangeControl
                                label={ __('Filters Area Width (%)', 'tainacan') }
                                value={ filtersAreaWidth }
                                onChange={ ( width ) => setAttributes( { filtersAreaWidth: width } ) }
                                min={ 10 }
                                max={ 40 }
                            />
                            <HorizontalRule />
                            <BaseControl
                                    id="backgroundColorPicker"
                                    label={ __('Background color', 'tainacan')}
                                    help={ __('The background color of the entire items list', 'tainacan') }>
                                <ColorPicker
                                    color={ backgroundColor }
                                    onChangeComplete={ (colorValue ) => {
                                        backgroundColor = colorValue.hex;
                                        setAttributes({ backgroundColor: backgroundColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="secondaryColorPicker"
                                    label={ __('Link and Active Main color', 'tainacan')}
                                    help={ __('The text color links and other action or active state elements, such as select arrows, tooltip contents, etc', 'tainacan') }>
                                <ColorPicker
                                    color={ secondaryColor }
                                    onChangeComplete={ (colorValue ) => {
                                        secondaryColor = colorValue.hex;
                                        setAttributes({ secondaryColor: secondaryColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="primaryColorPicker"
                                    label={ __('Tooltips background color', 'tainacan')}
                                    help={ __('The tooltips background color and other elements, such as the hide filters button', 'tainacan') }>
                                <ColorPicker
                                    color={ primaryColor }
                                    onChangeComplete={ (colorValue ) => {
                                        primaryColor = colorValue.hex;
                                        setAttributes({ primaryColor: primaryColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="inputBackgroundColorPicker"
                                    label={ __('Input Background color', 'tainacan')}
                                    help={ __('The background color for input fields', 'tainacan') }>
                                <ColorPicker
                                    color={ inputBackgroundColor }
                                    onChangeComplete={ (colorValue ) => {
                                        inputBackgroundColor = colorValue.hex;
                                        setAttributes({ inputBackgroundColor: inputBackgroundColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="inputColorPicker"
                                    label={ __('Input Text color', 'tainacan')}
                                    help={ __('The text color for input fields, including dropdowns and buttons', 'tainacan') }>
                                <ColorPicker
                                    color={ inputColor }
                                    onChangeComplete={ (colorValue ) => {
                                        inputColor = colorValue.hex;
                                        setAttributes({ inputColor: inputColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="inputBorderColorPicker"
                                    label={ __('Input Border color', 'tainacan')}
                                    help={ __('The border color for input fields', 'tainacan') }>
                                <ColorPicker
                                    color={ inputBorderColor }
                                    onChangeComplete={ (colorValue ) => {
                                        inputBorderColor = colorValue.hex;
                                        setAttributes({ inputBorderColor: inputBorderColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="labelColorPicker"
                                    label={ __('Label Text color', 'tainacan')}
                                    help={ __('The text color for field labels', 'tainacan') }>
                                <ColorPicker
                                    color={ labelColor }
                                    onChangeComplete={ (colorValue ) => {
                                        labelColor = colorValue.hex;
                                        setAttributes({ labelColor: labelColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="headingColorPicker"
                                    label={ __('Headings Text color', 'tainacan')}
                                    help={ __('The text color for headings such as items title and filters menu header', 'tainacan') }>
                                <ColorPicker
                                    color={ headingColor }
                                    onChangeComplete={ (colorValue ) => {
                                        headingColor = colorValue.hex;
                                        setAttributes({ headingColor: headingColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="infoColorPicker"
                                    label={ __('General Info Text color', 'tainacan')}
                                    help={ __('The text color for other information such as item metadata, icons, number of pages, etc', 'tainacan') }>
                                <ColorPicker
                                    color={ infoColor }
                                    onChangeComplete={ (colorValue ) => {
                                        infoColor = colorValue.hex;
                                        setAttributes({ infoColor: infoColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <BaseControl
                                    id="itemBackgroundColorPicker"
                                    label={ __('Item Background color', 'tainacan')}
                                    help={ __('The background color for an item on the list', 'tainacan') }>
                                <ColorPicker
                                    color={ itemBackgroundColor }
                                    onChangeComplete={ (colorValue ) => {
                                        itemBackgroundColor = colorValue.hex;
                                        setAttributes({ itemBackgroundColor: itemBackgroundColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="itemHoverBackgroundColorPicker"
                                    label={ __('Item Hover Background color', 'tainacan')}
                                    help={ __('The background color for an item on the list, when hovered', 'tainacan') }>
                                <ColorPicker
                                    color={ itemHoverBackgroundColor }
                                    onChangeComplete={ (colorValue ) => {
                                        itemHoverBackgroundColor = colorValue.hex;
                                        skeletonColor = colorValue.hex;
                                        setAttributes({ 
                                            itemHoverBackgroundColor: itemHoverBackgroundColor,
                                            skeletonColor: skeletonColor
                                        });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                            <HorizontalRule />
                            <BaseControl
                                    id="itemHeadingHoverBackgroundColorPicker"
                                    label={ __('Item Heading Hover Background color', 'tainacan')}
                                    help={ __('The background color for the item heading (where the title is), when hovered', 'tainacan') }>
                                <ColorPicker
                                    color={ itemHeadingHoverBackgroundColor }
                                    onChangeComplete={ (colorValue ) => {
                                        itemHeadingHoverBackgroundColor = colorValue.hex;
                                        setAttributes({ itemHeadingHoverBackgroundColor: itemHeadingHoverBackgroundColor });
                                    }}
                                    disableAlpha
                                />
                            </BaseControl>
                        </PanelBody>
                       
                    </InspectorControls>
                </div>

                { listType == '' || ( termId == undefined && listType == 'term' ) || ( collectionId == undefined && listType == 'collection' ) ? (
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
                                    viewBox="0 0 6.3499998 6.3499998"
                                    height="24px"
                                    width="24px">
                                <g transform="matrix(0.2891908,0,0,0.2891908,-30.465367,-38.43427)">
                                    <path 
                                            transform="matrix(0.26458333,0,0,0.26458333,104.32258,131.88168)"
                                            fill="#298596"
                                            d="M 16.662109,14.712891 V 24.927734 H 84.753906 V 14.712891 Z m 6.810547,17.021484 v 9.748047 c 6.857764,2.272819 11.798639,8.605281 11.798828,16.078125 -7.56e-4,2.313298 -0.496344,4.586348 -1.421875,6.693359 l 8.375,8.375 -3.365234,3.367188 H 77.945312 V 31.734375 Z m 17.019532,10.216797 h 20.429687 v 10.21289 H 40.492188 Z m -22.835938,3.84375 a 9.1779065,9.1779065 0 0 0 -0.916016,0.03906 11.753475,11.753475 0 0 0 1.671875,23.445313 11.455635,11.455635 0 0 0 6.466797,-1.910156 l 1.908203,1.910156 2.88086,2.982422 3.820312,3.716797 3.347657,-3.347657 -3.851563,-3.855468 -2.847656,-2.845703 -1.941407,-1.941407 a 11.455635,11.455635 0 0 0 1.941407,-6.433593 11.723603,11.723603 0 0 0 -6.697266,-10.583985 11.422139,11.422139 0 0 0 -5.027344,-1.136719 9.1779065,9.1779065 0 0 0 -0.755859,-0.03906 z m 0.755859,6.736328 a 5.0244015,5.0244015 0 0 1 5.027344,5.025391 v 0.101562 a 5.0244015,5.0244015 0 0 1 -0.269531,1.570313 4.9574094,4.9574094 0 0 1 -4.757813,3.351562 5.0244015,5.0244015 0 0 1 -1.671875,-9.746094 4.6559456,4.6559456 0 0 1 1.671875,-0.302734 z m 6.376953,20.601562 c -0.431168,0.183308 -0.872311,0.335613 -1.316406,0.484376 v 2.378906 h 4.179688 z "/>
                                </g>
                            </svg>
                            {__('Show a complete items list with faceted search from: ', 'tainacan')}
                        </p>
                        <Dropdown
                                contentClassName="wp-block-tainacan__dropdown"
                                renderToggle={ ( { isOpen, onToggle } ) => (
                                    <Button
                                        isPrimary
                                        onClick={ onToggle }
                                        aria-expanded={ isOpen }>
                                           { __('Items list source', 'tainacan') }
                                    </Button>
                                ) }
                                renderContent={ ( { onToggle } ) => (
                                    <MenuGroup>
                                        <MenuItemsChoice
                                            choices={ listTypeChoices }
                                            value={ listType } 
                                            onSelect={ (value) => {
                                                onUpdateListType(value);
                                                onToggle(); 
                                            }}>
                                        </MenuItemsChoice>
                                    </MenuGroup>
                                ) }
                            />
                           
                    </Placeholder>
                    ) :
                    (
                        <div style={{ fontSize: (baseFontSize - 2) + 'px' }}>
                            <div class="preview-warning">
                                { __('Warning: this is just a demonstration. To see the items list, either preview or publish your post.', 'tainacan') }
                            </div>
                            <div 
                                    style={{
                                        '--tainacan-background-color': backgroundColor,
                                        '--tainacan-filter-menu-width-theme': filtersAreaWidth + '%',
                                        '--tainacan-input-color': inputColor,
                                        '--tainacan-input-background-color': inputBackgroundColor,
                                        '--tainacan-input-border-color': inputBorderColor,
                                        '--tainacan-label-color': labelColor,
                                        '--tainacan-info-color': infoColor,
                                        '--tainacan-heading-color': headingColor,
                                        '--tainacan-skeleton-color': skeletonColor,
                                        '--tainacan-item-background-color': itemBackgroundColor,
                                        '--tainacan-item-hover-background-color': itemHoverBackgroundColor,
                                        '--tainacan-item-heading-hover-background-color': itemHeadingHoverBackgroundColor,
                                        '--tainacan-primary': primaryColor,
                                        '--tainacan-secondary': secondaryColor
                                    }}
                                    class="items-list-placeholder">
                                <div class="search-control">
                                    { 
                                        !hideSearch ?
                                        <span class="fake-searchbar">
                                            { !hideAdvancedSearch ? <span class="fake-advanced-searchbar"></span> : null }
                                        </span>
                                        : null
                                    }
                                    {
                                        showFiltersButtonInsideSearchControl && !hideHideFiltersButton ? <span class="fake-button"><div class="fake-icon"></div><div class="fake-text"></div></span> : null
                                    }
                                    { 
                                        !hideDisplayedMetadataButton ?
                                        <span class="fake-button"><div class="fake-text"></div></span>
                                     :null
                                    }
                                    { 
                                        !hideSortingArea ?
                                        <span class="fake-button"> { !hideSortByButton ? <div class="fake-text"></div> : null }<div class="fake-icon"></div><div class="fake-text"></div></span>
                                    :null 
                                    }
                                    {
                                        !showInlineViewModeOptions ? 
                                            <span class="fake-button"><div class="fake-icon"></div><div class="fake-text"></div></span> 
                                        : 
                                            <div class="fake-buttons-group">
                                                { Array(3).fill().map( () => <div class="fake-button"><div class="fake-icon"></div></div> )}
                                                { showFullscreenWithViewModes ? <span class="fake-button"><div class="fake-icon"></div></span> : null }
                                            </div>
                                    }
                                    {
                                        !showFullscreenWithViewModes ? <span class="fake-button"><div class="fake-icon"></div><div class="fake-text"></div></span> : null
                                    }
                                    {
                                        !hideExposersButton ? <span class="fake-button"><div class="fake-icon"></div><div class="fake-text"></div></span> : null
                                    }
                                </div>
                                <div class="below-search-control">
                                    { !showFiltersButtonInsideSearchControl & !hideHideFiltersButton && !hideFilters ? <span class="fake-hide-button"><div class="fake-icon"></div></span> : null }
                                    { 
                                        !hideFilters && !filtersAsModal && !startWithFiltersHidden ?
                                            <div 
                                                    style={{
                                                        flexBasis: filtersAreaWidth + '%'
                                                    }}
                                                    class="filters">
                                                <div class="fake-filters-heading"></div>
                                                { Array(2).fill().map( () => {
                                                    return <div class="fake-filter">
                                                        <span class="fake-text"></span>
                                                        <span class="fake-searchbar"></span>
                                                    </div>
                                                } )}
                                                <div class="fake-filter">
                                                    <span class="fake-text"></span>
                                                    <div class="fake-checkbox-list">
                                                        { Array(4).fill().map( () => {
                                                            return <div>
                                                                <span class="fake-checkbox"></span>
                                                                <span class="fake-text"></span>
                                                            </div>
                                                        } ) }
                                                        <div class="fake-link"></div>
                                                    </div>
                                                </div>
                                                <div class="fake-filter">
                                                    <span class="fake-text"></span>
                                                    <span class="fake-searchbar"></span>
                                                </div>
                                                <div class="fake-filter">
                                                    <span class="fake-text"></span>
                                                    <div class="fake-checkbox-list">
                                                        { Array(2).fill().map( () => {
                                                            return <div>
                                                                <span class="fake-checkbox"></span>
                                                                <span class="fake-text"></span>
                                                            </div>
                                                        } ) }
                                                        <div class="fake-link"></div>
                                                    </div>
                                                </div>
                                            </div> 
                                        : null 
                                    }
                                    <div class="aside-filters">    
                                        <div className={ 'items' + (hideItemsThumbnail ? ' items-without-thumbnail' : '') }>
                                            { Array(5).fill().map( () => {
                                                return <div class="fake-item">
                                                    <div class="fake-item-header">
                                                        <div class="fake-text"></div>
                                                    </div>
                                                    <div 
                                                            style={{ 
                                                                backgroundImage: tainacan_plugin ? 'url("' + tainacan_plugin.base_url + '/assets/images/placeholder_square.png")' : '' 
                                                            }}
                                                            class="fake-item-thumb"></div>
                                                    { Array(3).fill().map( () => <div class="fake-item-description"></div> ) }
                                                </div>
                                            } ) }
                                            <div class="fake-item fake-item-hovered">
                                                <div class="fake-item-header">
                                                    <div class="fake-tooltip"><div class="fake-link"></div></div>
                                                    <div class="fake-text"></div>
                                                </div>
                                                <div 
                                                        style={{ 
                                                            backgroundImage: tainacan_plugin ? 'url("' + tainacan_plugin.base_url + '/assets/images/placeholder_square.png")' : '' 
                                                        }}
                                                        class="fake-item-thumb"></div>
                                                { Array(3).fill().map( () => <div class="fake-item-description"></div> ) }
                                            </div>
                                            { Array(2).fill().map( () => {
                                                return <div class="fake-item">
                                                    <div class="fake-item-header">
                                                        <div class="fake-text"></div>
                                                    </div>
                                                    <div 
                                                            style={{ 
                                                                backgroundImage: tainacan_plugin ? 'url("' + tainacan_plugin.base_url + '/assets/images/placeholder_square.png")' : '' 
                                                            }}
                                                            class="fake-item-thumb"></div>
                                                    { Array(3).fill().map( () => <div class="fake-item-description"></div> ) }
                                                </div>
                                            } ) }
                                        </div>
                                        { !hidePaginationArea ?
                                        <div class="pagination">
                                            <span class="fake-text"></span>
                                            { !hideItemsPerPageButton ? <span class="fake-button"><div class="fake-text"></div></span> : null }
                                            { !hideGoToPageButton ? <span class="fake-button"><div class="fake-text"></div></span> : null }
                                            <div class="fake-buttons-group">
                                                { Array(6).fill().map( () => <div class="fake-link"></div> ) }
                                            </div>
                                        </div>
                                        : null }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                { isCollectionModalOpen ? 
                    <CollectionModal
                        existingCollectionId={ collectionId }  
                        existingCollectionDefaultViewMode={ collectionDefaultViewMode } 
                        existingCollectionEnabledViewModes={ collectionEnabledViewModes }
                        onSelectCollection={ ({ collectionId, collectionDefaultViewMode, collectionEnabledViewModes }) => {
                            collectionId = collectionId;
                            collectionDefaultViewMode = collectionDefaultViewMode ? collectionDefaultViewMode : defaultViewMode;
                            collectionEnabledViewModes = collectionEnabledViewModes && collectionEnabledViewModes.length ? collectionEnabledViewModes : enabledViewModes;
                            setAttributes({
                                collectionId: collectionId, 
                                collectionDefaultViewMode: collectionDefaultViewMode,
                                defaultViewMode: collectionDefaultViewMode,
                                collectionEnabledViewModes: collectionEnabledViewModes,
                                enabledViewModes: collectionEnabledViewModes,
                                isCollectionModalOpen: false
                            });
                        }}
                        onCancelSelection={ () => setAttributes({ isCollectionModalOpen: false }) }/> 
                    : null
                }

                { isTermModalOpen ? 
                    <TermModal
                        existingTermId={ termId } 
                        existingTaxonomyId={ taxonomyId } 
                        onSelectTaxonomy={ (selectedTaxonomy) => {
                            taxonomyId = selectedTaxonomy;
                            setAttributes({ taxonomyId: selectedTaxonomy });
                        }}
                        onSelectTerm={ (selectedTermId) => {
                            termId = selectedTermId;
                            enabledViewModes = registeredViewModesKeys;
                            
                            setAttributes({
                                termId: selectedTermId, 
                                isTermModalOpen: false,
                                enabledViewModes: enabledViewModes
                            });
                        }}
                        onCancelSelection={ () => setAttributes({ isTermModalOpen: false }) }/> 
                    : null
                }

            </div>
            )
        );
    },
    save({ attributes, className }) {
        const {
            termId,
            taxonomyId,
            collectionId,
            defaultViewMode,
            enabledViewModes,
            collectionDefaultViewMode,
            collectionEnabledViewModes,
            hideDisplayedMetadataButton,
            hideSortingArea,
            hideFilters,
            hideHideFiltersButton,
            hideSearch,
            hideAdvancedSearch,
            hideSortByButton,
            hideItemsThumbnail,
            hidePaginationArea,
            hideExposersButton,
            hideItemsPerPageButton,
            defaultItemsPerPage,
            hideGoToPageButton,
            showFiltersButtonInsideSearchControl,
            startWithFiltersHidden,
            filtersAsModal,
            showInlineViewModeOptions,
            showFullscreenWithViewModes,
            listType,
            backgroundColor,
            baseFontSize,
            filtersAreaWidth,
            inputColor,
            inputBackgroundColor,
            inputBorderColor,
            labelColor,
            infoColor,
            headingColor,
            skeletonColor,
            itemBackgroundColor,
            itemHoverBackgroundColor,
            itemHeadingHoverBackgroundColor,
            primaryColor,
            secondaryColor
        } = attributes;
        
        let updatedListType = '' + listType;

        if (updatedListType === '' && collectionId)
            updatedListType = 'collection';
        else if (updatedListType === '' && termId && taxonomyId)
            updatedListType = 'term' 

        return <div 
                    style={{
                        'font-size': baseFontSize + 'px',
                        '--tainacan-base-font-size': baseFontSize + 'px',
                        '--tainacan-background-color': backgroundColor,
                        '--tainacan-filter-menu-width-theme': filtersAreaWidth + '%',
                        '--tainacan-input-color': inputColor,
                        '--tainacan-input-background-color': inputBackgroundColor,
                        '--tainacan-input-border-color': inputBorderColor,
                        '--tainacan-label-color': labelColor,
                        '--tainacan-info-color': infoColor,
                        '--tainacan-heading-color': headingColor,
                        '--tainacan-skeleton-color': skeletonColor,
                        '--tainacan-item-background-color': itemBackgroundColor,
                        '--tainacan-item-hover-background-color': itemHoverBackgroundColor,
                        '--tainacan-item-heading-hover-background-color': itemHeadingHoverBackgroundColor,
                        '--tainacan-primary': primaryColor,
                        '--tainacan-secondary': secondaryColor
                    }}
                    className={ className }>
                <main 
                        term-id={ updatedListType == 'term' ? termId : null }
                        taxonomy={ updatedListType == 'term' ? 'tnc_tax_' + taxonomyId : null  }
                        collection-id={ updatedListType == 'collection' ? collectionId : null }  
                        default-view-mode={ defaultViewMode != 'none' ? defaultViewMode : (updatedListType == 'collection' ? collectionDefaultViewMode : (hideItemsThumbnail ? 'table' : 'masonry') ) }
                        is-forced-view-mode={ defaultViewMode == 'none' ? true : false }
                        enabled-view-modes={ enabledViewModes.toString() }  
                        hide-filters = { hideFilters.toString() }
                        hide-hide-filters-button= { hideHideFiltersButton.toString() }
                        hide-search = { hideSearch.toString() }
                        hide-advanced-search = { hideAdvancedSearch.toString() }
                        hide-displayed-metadata-button = { hideDisplayedMetadataButton.toString() }
                        hide-pagination-area = { hidePaginationArea.toString() }
                        hide-sorting-area = { hideSortingArea.toString() }
                        hide-items-thumbnail = { hideItemsThumbnail ? hideItemsThumbnail.toString() : 'false' }
                        hide-sort-by-button = { hideSortByButton.toString() }
                        hide-pagination-area = { hidePaginationArea.toString() }
                        hide-exposers-button = { hideExposersButton.toString() }
                        hide-items-per-page-button = { hideItemsPerPageButton.toString() }
                        default-items-per-page = { defaultItemsPerPage }
                        hide-go-to-page-button = { hideGoToPageButton.toString() }
                        show-filters-button-inside-search-control = { showFiltersButtonInsideSearchControl.toString() }
                        start-with-filters-hidden = { startWithFiltersHidden.toString() }
                        filters-as-modal = { filtersAsModal.toString() }
                        show-inline-view-mode-options = { showInlineViewModeOptions.toString() }
                        show-fullscreen-with-view-modes = { showFullscreenWithViewModes.toString() }
                        id="tainacan-items-page">
                </main>
            </div>
    },
    deprecated: [
        {
            attributes: {
                termId: {
                    type: String,
                    default: undefined
                },
                taxonomyId: {
                    type: String,
                    default: undefined
                },
                collectionId: {
                    type: String,
                    default: undefined
                },
                defaultViewMode: {
                    type: String,
                    default: 'masonry'
                },
                enabledViewModes: {
                    type: Array,
                    default: Object.keys(tainacan_plugin.registered_view_modes)
                },
                collectionDefaultViewMode: {
                    type: String,
                    default: 'masonry'
                },
                collectionEnabledViewModes: {
                    type: Array,
                    default: []
                },
                hideFilters: {
                    type: Boolean,
                    default: false
                },
                hideHideFiltersButton: {
                    type: Boolean,
                    default: false
                },
                hideSearch: {
                    type: Boolean,
                    default: false
                },
                hideAdvancedSearch: {
                    type: Boolean,
                    default: false
                },
                hideDisplayedMetadataButton: {
                    type: Boolean,
                    default: false
                },
                hideSortingArea: {
                    type: Boolean,
                    default: false
                },
                hideSortByButton: {
                    type: Boolean,
                    default: false
                },
                hideExposersButton: {
                    type: Boolean,
                    default: false
                },
                hideItemsPerPageButton: {
                    type: Boolean,
                    default: false
                },
                defaultItemsPerPage: {
                    type: Number,
                    default: 12
                },
                hideGoToPageButton: {
                    type: Boolean,
                    default: false
                },
                hidePaginationArea: {
                    type: Boolean,
                    default: false
                },
                showFiltersButtonInsideSearchControl: {
                    type: Boolean,
                    default: false
                },
                startWithFiltersHidden: {
                    type: Boolean,
                    default: false
                },
                filtersAsModal: {
                    type: Boolean,
                    default: false
                },
                showInlineViewModeOptions: {
                    type: Boolean,
                    default: false
                },
                showFullscreenWithViewModes: {
                    type: Boolean,
                    default: false
                },
                listType: {
                    type: String,
                    default: 'collection'
                },
                isCollectionModalOpen: {
                    type: Boolean,
                    default: false
                },
                isTermModalOpen: {
                    type: Boolean,
                    default: false
                },
                backgroundColor: {
                    type: String,
                    default: '#ffffff'
                },
                baseFontSize: {
                    type: Number,
                    default: 16
                },
                filtersAreaWidth: {
                    type: Number,
                    default: 20
                },
                inputColor: {
                    type: String,
                    default: '#1d1d1d'
                },
                inputBackgroundColor: {
                    type: String,
                    default: '#ffffff'
                },
                inputBorderColor: {
                    type: String,
                    default: '#dbdbdb'
                },
                labelColor: {
                    type: String,
                    default: '#454647'
                },
                infoColor: {
                    type: String,
                    default: '#555758'
                },
                headingColor: {
                    type: String,
                    default: '#000000'
                },
                skeletonColor: {
                    type: String,
                    default: '#eeeeee'
                },
                itemBackgroundColor: {
                    type: String,
                    default: '#ffffff'
                },
                itemHoverBackgroundColor: {
                    type: String,
                    default: '#f2f2f2'
                },
                itemHeadingHoverBackgroundColor: {
                    type: String,
                    default: '#dbdbdb'
                },
                primaryColor: {
                    type: String,
                    default: '#d9eced'
                },
                secondaryColor: {
                    type: String,
                    default: '#298596'
                }
            },
            save({ attributes, className }){
                const {
                    termId,
                    taxonomyId,
                    collectionId,
                    defaultViewMode,
                    enabledViewModes,
                    collectionDefaultViewMode,
                    collectionEnabledViewModes,
                    hideDisplayedMetadataButton,
                    hideSortingArea,
                    hideFilters,
                    hideHideFiltersButton,
                    hideSearch,
                    hideAdvancedSearch,
                    hideSortByButton,
                    hidePaginationArea,
                    hideExposersButton,
                    hideItemsPerPageButton,
                    defaultItemsPerPage,
                    hideGoToPageButton,
                    showFiltersButtonInsideSearchControl,
                    startWithFiltersHidden,
                    filtersAsModal,
                    showInlineViewModeOptions,
                    showFullscreenWithViewModes,
                    listType,
                    backgroundColor,
                    baseFontSize,
                    filtersAreaWidth,
                    inputColor,
                    inputBackgroundColor,
                    inputBorderColor,
                    labelColor,
                    infoColor,
                    headingColor,
                    skeletonColor,
                    itemBackgroundColor,
                    itemHoverBackgroundColor,
                    itemHeadingHoverBackgroundColor,
                    primaryColor,
                    secondaryColor
                } = attributes;
                
                return <div 
                            style={{
                                'font-size': baseFontSize + 'px',
                                '--tainacan-base-font-size': baseFontSize + 'px',
                                '--tainacan-background-color': backgroundColor,
                                '--tainacan-filter-menu-width-theme': filtersAreaWidth + '%',
                                '--tainacan-input-color': inputColor,
                                '--tainacan-input-background-color': inputBackgroundColor,
                                '--tainacan-input-border-color': inputBorderColor,
                                '--tainacan-label-color': labelColor,
                                '--tainacan-info-color': infoColor,
                                '--tainacan-heading-color': headingColor,
                                '--tainacan-skeleton-color': skeletonColor,
                                '--tainacan-item-background-color': itemBackgroundColor,
                                '--tainacan-item-hover-background-color': itemHoverBackgroundColor,
                                '--tainacan-item-heading-hover-background-color': itemHeadingHoverBackgroundColor,
                                '--tainacan-primary': primaryColor,
                                '--tainacan-secondary': secondaryColor
                            }}
                            className={ className }>
                        <main 
                                term-id={ listType == 'term' ? termId : null }
                                taxonomy={ listType == 'term' ? 'tnc_tax_' + taxonomyId : null  }
                                collection-id={ listType == 'collection' ? collectionId : null }  
                                default-view-mode={ defaultViewMode != 'none' ? defaultViewMode : (listType == 'collection' ? collectionDefaultViewMode : 'masonry') }
                                is-forced-view-mode={ defaultViewMode == 'none' ? true : false }
                                enabled-view-modes={ enabledViewModes.toString() }  
                                hide-filters = { hideFilters.toString() }
                                hide-hide-filters-button= { hideHideFiltersButton.toString() }
                                hide-search = { hideSearch.toString() }
                                hide-advanced-search = { hideAdvancedSearch.toString() }
                                hide-displayed-metadata-button = { hideDisplayedMetadataButton.toString() }
                                hide-pagination-area = { hidePaginationArea.toString() }
                                hide-sorting-area = { hideSortingArea.toString() }
                                hide-sort-by-button = { hideSortByButton.toString() }
                                hide-pagination-area = { hidePaginationArea.toString() }
                                hide-exposers-button = { hideExposersButton.toString() }
                                hide-items-per-page-button = { hideItemsPerPageButton.toString() }
                                default-items-per-page = { defaultItemsPerPage }
                                hide-go-to-page-button = { hideGoToPageButton.toString() }
                                show-filters-button-inside-search-control = { showFiltersButtonInsideSearchControl.toString() }
                                start-with-filters-hidden = { startWithFiltersHidden.toString() }
                                filters-as-modal = { filtersAsModal.toString() }
                                show-inline-view-mode-options = { showInlineViewModeOptions.toString() }
                                show-fullscreen-with-view-modes = { showFullscreenWithViewModes.toString() }
                                id="tainacan-items-page">
                        </main>
                    </div>
            }
        },
        {
            attributes: {
                termId: {
                    type: String,
                    default: undefined
                },
                taxonomyId: {
                    type: String,
                    default: undefined
                },
                collectionId: {
                    type: String,
                    default: undefined
                },
                defaultViewMode: {
                    type: String,
                    default: 'masonry'
                },
                enabledViewModes: {
                    type: Array,
                    default: Object.keys(tainacan_plugin.registered_view_modes)
                },
                collectionDefaultViewMode: {
                    type: String,
                    default: 'masonry'
                },
                collectionEnabledViewModes: {
                    type: Array,
                    default: []
                },
                hideFilters: {
                    type: Boolean,
                    default: false
                },
                hideHideFiltersButton: {
                    type: Boolean,
                    default: false
                },
                hideSearch: {
                    type: Boolean,
                    default: false
                },
                hideAdvancedSearch: {
                    type: Boolean,
                    default: false
                },
                hideDisplayedMetadataButton: {
                    type: Boolean,
                    default: false
                },
                hideSortingArea: {
                    type: Boolean,
                    default: false
                },
                hideSortByButton: {
                    type: Boolean,
                    default: false
                },
                hideExposersButton: {
                    type: Boolean,
                    default: false
                },
                hideItemsPerPageButton: {
                    type: Boolean,
                    default: false
                },
                defaultItemsPerPage: {
                    type: Number,
                    default: 12
                },
                hideGoToPageButton: {
                    type: Boolean,
                    default: false
                },
                hidePaginationArea: {
                    type: Boolean,
                    default: false
                },
                showFiltersButtonInsideSearchControl: {
                    type: Boolean,
                    default: false
                },
                startWithFiltersHidden: {
                    type: Boolean,
                    default: false
                },
                filtersAsModal: {
                    type: Boolean,
                    default: false
                },
                showInlineViewModeOptions: {
                    type: Boolean,
                    default: false
                },
                showFullscreenWithViewModes: {
                    type: Boolean,
                    default: false
                },
                listType: {
                    type: String,
                    default: ''
                },
                isCollectionModalOpen: {
                    type: Boolean,
                    default: false
                },
                isTermModalOpen: {
                    type: Boolean,
                    default: false
                },
                backgroundColor: {
                    type: String,
                    default: '#ffffff'
                },
                baseFontSize: {
                    type: Number,
                    default: 16
                },
                filtersAreaWidth: {
                    type: Number,
                    default: 20
                },
                inputColor: {
                    type: String,
                    default: '#1d1d1d'
                },
                inputBackgroundColor: {
                    type: String,
                    default: '#ffffff'
                },
                inputBorderColor: {
                    type: String,
                    default: '#dbdbdb'
                },
                labelColor: {
                    type: String,
                    default: '#454647'
                },
                infoColor: {
                    type: String,
                    default: '#555758'
                },
                headingColor: {
                    type: String,
                    default: '#000000'
                },
                skeletonColor: {
                    type: String,
                    default: '#eeeeee'
                },
                itemBackgroundColor: {
                    type: String,
                    default: '#ffffff'
                },
                itemHoverBackgroundColor: {
                    type: String,
                    default: '#f2f2f2'
                },
                itemHeadingHoverBackgroundColor: {
                    type: String,
                    default: '#dbdbdb'
                },
                primaryColor: {
                    type: String,
                    default: '#d9eced'
                },
                secondaryColor: {
                    type: String,
                    default: '#298596'
                }
            },
            save({ attributes, className }) {
                const {
                    termId,
                    taxonomyId,
                    collectionId,
                    defaultViewMode,
                    enabledViewModes,
                    collectionDefaultViewMode,
                    collectionEnabledViewModes,
                    hideDisplayedMetadataButton,
                    hideSortingArea,
                    hideFilters,
                    hideHideFiltersButton,
                    hideSearch,
                    hideAdvancedSearch,
                    hideSortByButton,
                    hidePaginationArea,
                    hideExposersButton,
                    hideItemsPerPageButton,
                    defaultItemsPerPage,
                    hideGoToPageButton,
                    showFiltersButtonInsideSearchControl,
                    startWithFiltersHidden,
                    filtersAsModal,
                    showInlineViewModeOptions,
                    showFullscreenWithViewModes,
                    listType,
                    backgroundColor,
                    baseFontSize,
                    filtersAreaWidth,
                    inputColor,
                    inputBackgroundColor,
                    inputBorderColor,
                    labelColor,
                    infoColor,
                    headingColor,
                    skeletonColor,
                    itemBackgroundColor,
                    itemHoverBackgroundColor,
                    itemHeadingHoverBackgroundColor,
                    primaryColor,
                    secondaryColor
                } = attributes;
                
                return <div 
                            style={{
                                'font-size': baseFontSize + 'px',
                                '--tainacan-base-font-size': baseFontSize + 'px',
                                '--tainacan-background-color': backgroundColor,
                                '--tainacan-filter-menu-width-theme': filtersAreaWidth + '%',
                                '--tainacan-input-color': inputColor,
                                '--tainacan-input-background-color': inputBackgroundColor,
                                '--tainacan-input-border-color': inputBorderColor,
                                '--tainacan-label-color': labelColor,
                                '--tainacan-info-color': infoColor,
                                '--tainacan-heading-color': headingColor,
                                '--tainacan-skeleton-color': skeletonColor,
                                '--tainacan-item-background-color': itemBackgroundColor,
                                '--tainacan-item-hover-background-color': itemHoverBackgroundColor,
                                '--tainacan-item-heading-hover-background-color': itemHeadingHoverBackgroundColor,
                                '--tainacan-primary': primaryColor,
                                '--tainacan-secondary': secondaryColor
                            }}
                            className={ className }>
                        <main 
                                term-id={ listType == 'term' ? termId : null }
                                taxonomy={ listType == 'term' ? 'tnc_tax_' + taxonomyId : null  }
                                collection-id={ listType == 'collection' ? collectionId : null }  
                                default-view-mode={ defaultViewMode != 'none' ? defaultViewMode : (listType == 'collection' ? collectionDefaultViewMode : 'masonry') }
                                is-forced-view-mode={ defaultViewMode == 'none' ? true : false }
                                enabled-view-modes={ enabledViewModes.toString() }  
                                hide-filters = { hideFilters.toString() }
                                hide-hide-filters-button= { hideHideFiltersButton.toString() }
                                hide-search = { hideSearch.toString() }
                                hide-advanced-search = { hideAdvancedSearch.toString() }
                                hide-displayed-metadata-button = { hideDisplayedMetadataButton.toString() }
                                hide-pagination-area = { hidePaginationArea.toString() }
                                hide-sorting-area = { hideSortingArea.toString() }
                                hide-sort-by-button = { hideSortByButton.toString() }
                                hide-pagination-area = { hidePaginationArea.toString() }
                                hide-exposers-button = { hideExposersButton.toString() }
                                hide-items-per-page-button = { hideItemsPerPageButton.toString() }
                                default-items-per-page = { defaultItemsPerPage }
                                hide-go-to-page-button = { hideGoToPageButton.toString() }
                                show-filters-button-inside-search-control = { showFiltersButtonInsideSearchControl.toString() }
                                start-with-filters-hidden = { startWithFiltersHidden.toString() }
                                filters-as-modal = { filtersAsModal.toString() }
                                show-inline-view-mode-options = { showInlineViewModeOptions.toString() }
                                show-fullscreen-with-view-modes = { showFullscreenWithViewModes.toString() }
                                id="tainacan-items-page">
                        </main>
                    </div>
            },
        }
    ]
});