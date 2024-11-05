// This file is part of InvenioRDM
// Copyright (C) 2020-2024 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021-2022 Graz University of Technology.
// Copyright (C) 2022-2024 KTH Royal Institute of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/invenio_app_rdm/i18next";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import React, { Component, createRef, Fragment } from "react";
import { AccordionField, CustomFields } from "react-invenio-forms";
import {
    AccessRightField,
    DescriptionsField,
    CreatibutorsField,
    DeleteButton,
    DepositStatusBox,
    FileUploader,
    FormFeedback,
    PIDField,
    PreviewButton,
    LanguagesField,
    PublicationDateField,
    ResourceTypeField,
    PublishButton,
    EmbargoDateField,
    TitlesField,
    VersionField,
    DepositFormApp,
    CommunityHeader,
    SaveButton,
} from "@js/invenio_rdm_records";
import { Card, Container, Grid, Ref, Sticky } from "semantic-ui-react";
import PropTypes from "prop-types";
import Overridable from "react-overridable";
import { ShareDraftButton } from "./ShareDraftButton";

export class RDMDepositForm extends Component {
    constructor(props) {
        super(props);
        this.config = props.config || {};
        const { files, record } = this.props;

        this.vocabularies = {
            metadata: {
                ...this.config.vocabularies,

                creators: {
                    ...this.config.vocabularies.creators,
                    type: [
                        { text: "Person", value: "personal" },
                        { text: "Organization", value: "organizational" },
                    ],
                },

                category: [
                    { id: "Data & Tecnología", icon: "user", label: "Data & Tecnología", type_name: "Data & Tecnología"},
                    { id: "Mercado, Economía & Consumo", icon: "user", label: "Mercado, Economía & Consumo", type_name: "Mercado, Economía & Consumo"},
                    { id: "Marca, Creatividad & Medios", icon: "user", label: "Marca, Creatividad & Medios", type_name: "Marca, Creatividad & Medios"},
                    { id: "Sociedad & Sotenibilidad", icon: "user", label: "Sociedad & Sotenibilidad", type_name: "Sociedad & Sotenibilidad"},
                    { id: "Otros", icon: "user", label: "Otros", type_name: "Otros"},
                ],
                contributors: {
                    ...this.config.vocabularies.contributors,
                    type: [
                        { text: "Person", value: "personal" },
                        { text: "Organization", value: "organizational" },
                    ],
                },
                identifiers: {
                    ...this.config.vocabularies.identifiers,
                },
            },
        };

        // check if files are present
        this.noFiles = false;
        if (
            !Array.isArray(files.entries) ||
            (!files.entries.length && record.is_published)
        ) {
            this.noFiles = true;
        }

        // hide community header for branded communities
        this.hide_community_selection = this.config.hide_community_selection || false;
    }

    formFeedbackRef = createRef();
    sidebarRef = createRef();

    render() {
        const {
            record,
            files,
            permissions,
            preselectedCommunity,
            filesLocked,
            recordRestrictionGracePeriod,
            allowRecordRestriction,
            groupsEnabled,
            allowEmptyFiles,
        } = this.props;
        const customFieldsUI = this.config.custom_fields.ui;
        return (
            <DepositFormApp
                config={this.config}
                record={record}
                preselectedCommunity={preselectedCommunity}
                files={files}
                permissions={permissions}
            >
                <Overridable
                    id="InvenioAppRdm.Deposit.FormFeedback.container"
                    labels={this.config.custom_fields.error_labels}
                    fieldPath="message"
                >
                    <FormFeedback
                        fieldPath="message"
                        labels={this.config.custom_fields.error_labels}
                    />
                </Overridable>

                <Overridable
                    id="InvenioAppRdm.Deposit.CommunityHeader.container"
                    record={record}
                >
                    {!this.hide_community_selection && (
                        <CommunityHeader
                            imagePlaceholderLink="/static/images/square-placeholder.png"
                            record={record}
                        />
                    )}
                </Overridable>
                <Container id="rdm-deposit-form" className="rel-mt-1">
                    <Grid className="mt-25">
                        <Grid.Column mobile={16} tablet={16} computer={11}>
                            <Overridable
                                id="InvenioAppRdm.Deposit.AccordionFieldFiles.container"
                                record={record}
                                config={this.config}
                                noFiles={this.noFiles}
                            >
                                <AccordionField
                                    includesPaths={["files.enabled"]}
                                    active
                                    label={i18next.t("Files")}
                                >
                                    {this.noFiles && record.is_published && (
                                        <div className="text-align-center pb-10">
                                            <em>{i18next.t("The record has no files.")}</em>
                                        </div>
                                    )}
                                    <Overridable
                                        id="InvenioAppRdm.Deposit.FileUploader.container"
                                        record={record}
                                        config={this.config}
                                        permissions={permissions}
                                        filesLocked={filesLocked}
                                        allowEmptyFiles={allowEmptyFiles}
                                    >
                                        <FileUploader
                                            isDraftRecord={!record.is_published}
                                            quota={this.config.quota}
                                            decimalSizeDisplay={this.config.decimal_size_display}
                                            showMetadataOnlyToggle={permissions?.can_manage_files}
                                            allowEmptyFiles={allowEmptyFiles}
                                            filesLocked={filesLocked}
                                        />
                                    </Overridable>
                                </AccordionField>
                            </Overridable>
                            <Overridable
                                id="InvenioAppRdm.Deposit.AccordionFieldBasicInformation.container"
                                config={this.config}
                                record={record}
                                vocabularies={this.vocabularies}
                            >
                                <AccordionField
                                    includesPaths={[
                                        "metadata.publication_date",
                                        "metadata.title",
                                        "metadata.category",
                                        "metadata.topic",
                                        "metadata.subtopic",
                                        "metadata.description",
                                        "metadata.languages",
                                        "metadata.version",
                                    ]}
                                    active
                                    label={i18next.t("File Metadata information")}
                                >
                                    <Overridable
                                        id="InvenioAppRdm.Deposit.PIDField.container"
                                        config={this.config}
                                        record={record}
                                    >
                                        <Fragment>
                                            {this.config.pids.map((pid) => (
                                                <Fragment key={pid.scheme}>
                                                    <PIDField
                                                        btnLabelDiscardPID={pid.btn_label_discard_pid}
                                                        btnLabelGetPID={pid.btn_label_get_pid}
                                                        canBeManaged={pid.can_be_managed}
                                                        canBeUnmanaged={pid.can_be_unmanaged}
                                                        fieldPath={`pids.${pid.scheme}`}
                                                        fieldLabel={pid.field_label}
                                                        isEditingPublishedRecord={
                                                            record.is_published === true // is_published is `null` at first upload
                                                        }
                                                        managedHelpText={pid.managed_help_text}
                                                        pidLabel={pid.pid_label}
                                                        pidPlaceholder={pid.pid_placeholder}
                                                        pidType={pid.scheme}
                                                        unmanagedHelpText={pid.unmanaged_help_text}
                                                        required
                                                        record={record}
                                                    />
                                                </Fragment>
                                            ))}
                                        </Fragment>
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.ResourceTypeField.container"
                                        vocabularies={this.vocabularies}
                                        fieldPath="metadata.resource_type"
                                    >
                                        <ResourceTypeField
                                            options={this.vocabularies.metadata.resource_type}
                                            fieldPath="metadata.resource_type"
                                            required
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.PublicationDateField.container"
                                        fieldPath="metadata.publication_date"
                                    >
                                        <PublicationDateField
                                            required
                                            fieldPath="metadata.publication_date"
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.TitlesField.container"
                                        vocabularies={this.vocabularies}
                                        fieldPath="metadata.title"
                                    >
                                        <TitlesField
                                            fieldPath={"metadata.title"}
                                            required
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.SubjectsField.container"
                                        vocabularies={this.vocabularies}
                                        fieldPath="metadata.category"
                                        record={record}
                                    >
                                        <ResourceTypeField
                                            options={this.vocabularies.metadata.category}
                                            label={i18next.t("Category")}
                                            labelIcon="user"
                                            fieldPath="metadata.category"
                                            required
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.SubjectsField.container"
                                        vocabularies={this.vocabularies}
                                        fieldPath="metadata.topic"
                                        record={record}
                                    >
                                        <TitlesField
                                            fieldPath={"metadata.topic"}
                                            label={i18next.t("Topic")}
                                            required
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.SubjectsField.container"
                                        vocabularies={this.vocabularies}
                                        fieldPath="metadata.subtopic"
                                        record={record}
                                    >
                                        <TitlesField
                                            fieldPath={"metadata.subtopic"}
                                            label={i18next.t("Subtopic")}
                                            required
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.CreatorsField.container"
                                        vocabularies={this.vocabularies}
                                        config={this.config}
                                        fieldPath="metadata.creators"
                                    >
                                        <CreatibutorsField
                                            label={i18next.t("Creators")}
                                            labelIcon="user"
                                            fieldPath="metadata.creators"
                                            roleOptions={this.vocabularies.metadata.creators.role}
                                            schema="creators"
                                            autocompleteNames={this.config.autocomplete_names}
                                            required
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.DescriptionsField.container"
                                        vocabularies={this.vocabularies}
                                        fieldPath="metadata.description"
                                    >
                                        <DescriptionsField
                                            fieldPath="metadata.description"
                                            options={this.vocabularies.metadata.descriptions}
                                            required
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.LanguagesField.container"
                                        fieldPath="metadata.languages"
                                        record={record}
                                    >
                                        <LanguagesField
                                            fieldPath="metadata.languages"
                                            initialOptions={_get(record, "ui.languages", []).filter(
                                                (lang) => lang !== null
                                            )} // needed because dumped empty record from backend gives [null]
                                            serializeSuggestions={(suggestions) =>
                                                suggestions.map((item) => ({
                                                    text: item.title_l10n,
                                                    value: item.id,
                                                    key: item.id,
                                                }))
                                            }
                                        />
                                    </Overridable>

                                    <Overridable
                                        id="InvenioAppRdm.Deposit.VersionField.container"
                                        fieldPath="metadata.version"
                                    >
                                        <VersionField fieldPath="metadata.version" />
                                    </Overridable>
                                </AccordionField>
                            </Overridable>
                            {!_isEmpty(customFieldsUI) && (
                                <Overridable
                                    id="InvenioAppRdm.Deposit.CustomFields.container"
                                    record={record}
                                    customFieldsUI={customFieldsUI}
                                >
                                    <CustomFields
                                        config={customFieldsUI}
                                        record={record}
                                        templateLoaders={[
                                            (widget) => import(`@templates/custom_fields/${widget}.js`),
                                            (widget) =>
                                                import(`@js/invenio_rdm_records/src/deposit/customFields`),
                                            (widget) => import(`react-invenio-forms`),
                                        ]}
                                        fieldPathPrefix="custom_fields"
                                    />
                                </Overridable>
                            )}
                        </Grid.Column>
                        <Ref innerRef={this.sidebarRef}>
                            <Grid.Column
                                mobile={16}
                                tablet={16}
                                computer={5}
                                className="deposit-sidebar"
                            >
                                <Sticky context={this.sidebarRef} offset={20}>
                                    <Overridable
                                        id="InvenioAppRdm.Deposit.CardDepositStatusBox.container"
                                        record={record}
                                        permissions={permissions}
                                        groupsEnabled={groupsEnabled}
                                    >
                                        <Card>
                                            <Card.Content>
                                                <DepositStatusBox />
                                            </Card.Content>
                                            <Card.Content>
                                                <Grid relaxed>
                                                    <Grid.Column
                                                        computer={8}
                                                        mobile={16}
                                                        className="pb-0 left-btn-col"
                                                    >
                                                        <SaveButton fluid />
                                                    </Grid.Column>

                                                    <Grid.Column
                                                        computer={8}
                                                        mobile={16}
                                                        className="pb-0 right-btn-col"
                                                    >
                                                        <PreviewButton fluid />
                                                    </Grid.Column>

                                                    <Grid.Column width={16} className="pt-10">
                                                        <PublishButton fluid record={record} />
                                                    </Grid.Column>

                                                    <Grid.Column width={16} className="pt-0">
                                                        {(record.is_draft === null || permissions.can_manage) && (
                                                            <ShareDraftButton
                                                                record={record}
                                                                permissions={permissions}
                                                                groupsEnabled={groupsEnabled}
                                                            />
                                                        )}
                                                    </Grid.Column>
                                                </Grid>
                                            </Card.Content>
                                        </Card>
                                    </Overridable>
                                    <Overridable
                                        id="InvenioAppRdm.Deposit.AccessRightField.container"
                                        fieldPath="access"
                                        record={record}
                                        permissions={permissions}
                                        recordRestrictionGracePeriod={recordRestrictionGracePeriod}
                                        allowRecordRestriction={allowRecordRestriction}
                                    >
                                        <AccessRightField
                                            label={i18next.t("Visibility")}
                                            record={record}
                                            labelIcon="shield"
                                            fieldPath="access"
                                            showMetadataAccess={permissions?.can_manage_record_access}
                                            recordRestrictionGracePeriod={recordRestrictionGracePeriod}
                                            allowRecordRestriction={allowRecordRestriction}
                                        />
                                    </Overridable>
                                    {permissions?.can_delete_draft && (
                                        <Overridable
                                            id="InvenioAppRdm.Deposit.CardDeleteButton.container"
                                            record={record}
                                        >
                                            <Card>
                                                <Card.Content>
                                                    <DeleteButton fluid />
                                                </Card.Content>
                                            </Card>
                                        </Overridable>
                                    )}
                                </Sticky>
                            </Grid.Column>
                        </Ref>
                    </Grid>
                </Container>
            </DepositFormApp>
        );
    }
}

RDMDepositForm.propTypes = {
    groupsEnabled: PropTypes.bool.isRequired,
    config: PropTypes.object.isRequired,
    recordRestrictionGracePeriod: PropTypes.number.isRequired,
    allowRecordRestriction: PropTypes.bool.isRequired,
    record: PropTypes.object.isRequired,
    preselectedCommunity: PropTypes.object,
    files: PropTypes.object,
    permissions: PropTypes.object,
    filesLocked: PropTypes.bool,
    allowEmptyFiles: PropTypes.bool,
};

RDMDepositForm.defaultProps = {
    preselectedCommunity: undefined,
    permissions: null,
    files: null,
    filesLocked: false,
    allowEmptyFiles: true,
};