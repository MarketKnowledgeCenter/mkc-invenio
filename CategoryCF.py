from invenio_records_resources.services.custom_fields import BaseListCF
from marshmallow import fields
from marshmallow_utils.fields import SanitizedUnicode

class CategoryCF(BaseListCF):
    """Experiments with title and program."""

    def __init__(self, name, **kwargs):
        """Constructor."""
        super().__init__(
          name,
          field_cls=fields.Nested,
          field_args=dict(
            nested= dict(
                value=SanitizedUnicode()
            )
          ),
          multiple=True,
          **kwargs
        )


    @property
    def mapping(self):
        """Return the mapping."""
        return {
            "properties": {
                "category": {
                    "type": "text"
                }
            }
        }