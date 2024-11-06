import React, { Component } from "react";

import { Input, Array } from "react-invenio-forms";
import { Grid, Form, Button, Icon } from "semantic-ui-react";

const newCategory = {
    category: "",
};

export class Category extends Component {
    render() {
        const {
            fieldPath, // injected by the custom field loader via the `field` config property
            category,
            icon,
            addButtonLabel,
            label,
        } = this.props;
        return (
            <Array
                fieldPath={fieldPath}
                label={label}
                icon={icon}
                addButtonLabel={addButtonLabel}
                defaultNewValue={newCategory}
            >
                {({ arrayHelpers, indexPath }) => {
                    const fieldPathPrefix = `${fieldPath}.${indexPath}`;
                    return (
                        <Grid>
                            <Grid.Column width="7">
                                <Input
                                    fieldPath={`${fieldPathPrefix}.title`}
                                    label={"Category"}
                                    placeholder={category}
                                ></Input>
                            </Grid.Column>
                            <Grid.Column width="1">
                                <Form.Field style={{ marginTop: "1.75rem", float: "right" }}>
                                    <Button
                                        aria-label={"Remove field"}
                                        className="close-btn"
                                        icon
                                        onClick={() => arrayHelpers.remove(indexPath)}
                                        type="button"
                                    >
                                        <Icon name="close" />
                                    </Button>
                                </Form.Field>
                            </Grid.Column>
                        </Grid>
                    );
                }}
            </Array>
        );
    }
}