const { __ } = wp.i18n;

export default [
    /* Depecrated on Tainacan 0.18.3, due to the introduction of helpInfoBellowLabel */
    {
        attributes: {
            collectionId: {
                type: String,
                default: undefined
            },
            isCollectionModalOpen: {
                type: Boolean,
                default: false
            },
            hideFileModalButton: {
                type: Boolean,
                default: false
            },
            hideTextModalButton: {
                type: Boolean,
                default: false
            },
            hideLinkModalButton: {
                type: Boolean,
                default: false
            },
            hideThumbnailSection: {
                type: Boolean,
                default: false
            },
            hideAttachmentsSection: {
                type: Boolean,
                default: false
            },
            hideHelpButtons: {
                type: Boolean,
                default: false
            },
            hideMetadataTypes: {
                type: Boolean,
                default: false
            },
            showAllowCommentsSection: {
                type: Boolean,
                default: false
            },
            hideCollapses: {
                type: Boolean,
                default: false
            },
            backgroundColor: {
                type: Object,
                default: { r: 255, g: 255, b: 255, a: 0}
            },
            baseFontSize: {
                type: Number,
                default: 16
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
            primaryColor: {
                type: String,
                default: '#d9eced'
            },
            secondaryColor: {
                type: String,
                default: '#298596'
            },
            enabledMetadata: {
                type: Array,
                default: []
            },
            collectionMetadata: {
                type: Array,
                default: []
            },
            isLoadingCollectionMetadata: {
                type: Boolean,
                default: false
            },
            sentFormHeading: {
                type: String,
                default: __( 'Form submitted!', 'tainacan' )
            },
            sentFormMessage: {
                type: String,
                default: __( 'Thank you. Your item was submitted to the collection.', 'tainacan' )
            },
            documentSectionLabel: {
                type: String,
                default: __( 'Document', 'tainacan' )
            },
            attachmentsSectionLabel: {
                type: String,
                default: __( 'Attachments', 'tainacan' )
            },
            thumbnailSectionLabel: {
                type: String,
                default: __( 'Thumbnail', 'tainacan' )
            },
            metadataSectionLabel: {
                type: String,
                default: __( 'Metadata', 'tainacan' )
            },
            showItemLinkButton: {
                type: Boolean,
                default: false
            },
            itemLinkButtonLabel: {
                type: String,
                default: __( 'Go to the item page', 'tainacan' )
            }
        },
        supports: {
            align: ['full', 'wide'],
            html: true,
            multiple: false
        },
        save({ attributes, className }){
            const {
                collectionId,
                backgroundColor,
                hideFileModalButton,
                hideTextModalButton,
                hideLinkModalButton,
                hideThumbnailSection,
                hideAttachmentsSection,
                showAllowCommentsSection,
                hideHelpButtons,
                hideMetadataTypes,
                hideCollapses,
                documentSectionLabel,
                thumbnailSectionLabel,
                attachmentsSectionLabel,
                metadataSectionLabel,
                baseFontSize,
                inputColor,
                inputBackgroundColor,
                inputBorderColor,
                labelColor,
                infoColor,
                primaryColor,
                secondaryColor,
                enabledMetadata,
                sentFormHeading,
                sentFormMessage,
                showItemLinkButton,
                itemLinkButtonLabel
            } = attributes;
            
            return <div 
                        style={{
                            'font-size': baseFontSize + 'px',
                            '--tainacan-base-font-size': baseFontSize + 'px',
                            '--tainacan-background-color': 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b + ',' + backgroundColor.a + ')',
                            '--tainacan-input-color': inputColor,
                            '--tainacan-input-background-color': inputBackgroundColor,
                            '--tainacan-input-border-color': inputBorderColor,
                            '--tainacan-label-color': labelColor,
                            '--tainacan-info-color': infoColor,
                            '--tainacan-primary': primaryColor,
                            '--tainacan-secondary': secondaryColor
                        }}
                        className={ className }>
                <div 
                        id="tainacan-item-submission-form"
                        collection-id={ collectionId }
                        hide-file-modal-button={ hideFileModalButton.toString() }
                        hide-text-modal-button={ hideTextModalButton.toString() }
                        hide-link-modal-button={ hideLinkModalButton.toString() }
                        hide-thumbnail-section={ hideThumbnailSection.toString() }
                        hide-attachments-section={ hideAttachmentsSection.toString() }
                        show-allow-comments-section={ showAllowCommentsSection.toString() }
                        hide-help-buttons={ hideHelpButtons.toString() }
                        hide-metadata-types={ hideMetadataTypes.toString() }
                        hide-collapses={ hideCollapses.toString() }
                        enabled-metadata={ enabledMetadata.toString() }
                        sent-form-heading={ sentFormHeading }
                        sent-form-message={ sentFormMessage }
                        document-section-label={ documentSectionLabel }
                        thumbnail-section-label={ thumbnailSectionLabel }
                        attachments-section-label={ attachmentsSectionLabel }
                        metadata-section-label={ metadataSectionLabel }
                        show-item-link-button={ showItemLinkButton ? showItemLinkButton.toString() : 'false' }
                        item-link-button-label={ itemLinkButtonLabel ? itemLinkButtonLabel : __( 'Go to the item page', 'tainacan' ) } >
                </div>
            </div>
        }
    },
    /* Deprecated on Tainacan 0.18, due to the introduction of itemLinkButtonLabel and showItemLinkButton */
    {
        attributes: {
            collectionId: {
                type: String,
                default: undefined
            },
            isCollectionModalOpen: {
                type: Boolean,
                default: false
            },
            hideFileModalButton: {
                type: Boolean,
                default: false
            },
            hideTextModalButton: {
                type: Boolean,
                default: false
            },
            hideLinkModalButton: {
                type: Boolean,
                default: false
            },
            hideThumbnailSection: {
                type: Boolean,
                default: false
            },
            hideAttachmentsSection: {
                type: Boolean,
                default: false
            },
            hideHelpButtons: {
                type: Boolean,
                default: false
            },
            hideMetadataTypes: {
                type: Boolean,
                default: false
            },
            showAllowCommentsSection: {
                type: Boolean,
                default: false
            },
            hideCollapses: {
                type: Boolean,
                default: false
            },
            backgroundColor: {
                type: Object,
                default: { r: 255, g: 255, b: 255, a: 0}
            },
            baseFontSize: {
                type: Number,
                default: 16
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
            primaryColor: {
                type: String,
                default: '#d9eced'
            },
            secondaryColor: {
                type: String,
                default: '#298596'
            },
            enabledMetadata: {
                type: Array,
                default: []
            },
            collectionMetadata: {
                type: Array,
                default: []
            },
            isLoadingCollectionMetadata: {
                type: Boolean,
                default: false
            },
            sentFormHeading: {
                type: String,
                default: __( 'Form submitted!', 'tainacan' )
            },
            sentFormMessage: {
                type: String,
                default: __( 'Thank you. Your item was submitted to the collection.', 'tainacan' )
            },
            documentSectionLabel: {
                type: String,
                default: __( 'Document', 'tainacan' )
            },
            attachmentsSectionLabel: {
                type: String,
                default: __( 'Attachments', 'tainacan' )
            },
            thumbnailSectionLabel: {
                type: String,
                default: __( 'Thumbnail', 'tainacan' )
            },
            metadataSectionLabel: {
                type: String,
                default: __( 'Metadata', 'tainacan' )
            }
        },
        supports: {
            align: ['full', 'wide'],
            html: true,
            multiple: false
        },
        save({ attributes, className }){
            const {
                collectionId,
                backgroundColor,
                hideFileModalButton,
                hideTextModalButton,
                hideLinkModalButton,
                hideThumbnailSection,
                hideAttachmentsSection,
                showAllowCommentsSection,
                hideHelpButtons,
                hideMetadataTypes,
                hideCollapses,
                documentSectionLabel,
                thumbnailSectionLabel,
                attachmentsSectionLabel,
                metadataSectionLabel,
                baseFontSize,
                inputColor,
                inputBackgroundColor,
                inputBorderColor,
                labelColor,
                infoColor,
                primaryColor,
                secondaryColor,
                enabledMetadata,
                sentFormHeading,
                sentFormMessage,
            } = attributes;
            
            return <div 
                        style={{
                            'font-size': baseFontSize + 'px',
                            '--tainacan-base-font-size': baseFontSize + 'px',
                            '--tainacan-background-color': 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b + ',' + backgroundColor.a + ')',
                            '--tainacan-input-color': inputColor,
                            '--tainacan-input-background-color': inputBackgroundColor,
                            '--tainacan-input-border-color': inputBorderColor,
                            '--tainacan-label-color': labelColor,
                            '--tainacan-info-color': infoColor,
                            '--tainacan-primary': primaryColor,
                            '--tainacan-secondary': secondaryColor
                        }}
                        className={ className }>
                <div 
                        id="tainacan-item-submission-form"
                        collection-id={ collectionId }
                        hide-file-modal-button={ hideFileModalButton.toString() }
                        hide-text-modal-button={ hideTextModalButton.toString() }
                        hide-link-modal-button={ hideLinkModalButton.toString() }
                        hide-thumbnail-section={ hideThumbnailSection.toString() }
                        hide-attachments-section={ hideAttachmentsSection.toString() }
                        show-allow-comments-section={ showAllowCommentsSection.toString() }
                        hide-help-buttons={ hideHelpButtons.toString() }
                        hide-metadata-types={ hideMetadataTypes.toString() }
                        hide-collapses={ hideCollapses.toString() }
                        enabled-metadata={ enabledMetadata.toString() }
                        sent-form-heading={ sentFormHeading }
                        sent-form-message={ sentFormMessage }
                        document-section-label={ documentSectionLabel }
                        thumbnail-section-label={ thumbnailSectionLabel }
                        attachments-section-label={ attachmentsSectionLabel }
                        metadata-section-label={ metadataSectionLabel } >
                </div>
            </div>
        }
    }
]