# -*- coding: utf-8 -*-
#
# This file is part of Invenio.
# Copyright (C) 2023 CERN.
#
# Invenio is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Permission policy."""

from invenio_communities.permissions import CommunityPermissionPolicy
from invenio_rdm_records.services.generators import IfRecordDeleted
from invenio_rdm_records.services.permissions import RDMRecordPermissionPolicy
from invenio_records_permissions.generators import SystemProcess
from invenio_users_resources.services.permissions import UserManager

from .generators import Archiver, AuthenticatedRegularUser, CERNEmailsGroups


class CDSCommunitiesPermissionPolicy(CommunityPermissionPolicy):
    """Restrict community creation to only admins."""

    can_create = [UserManager()]


class CDSRDMRecordPermissionPolicy(RDMRecordPermissionPolicy):
    """Record permission policy."""

    can_create = [AuthenticatedRegularUser(), SystemProcess()]
    can_read = RDMRecordPermissionPolicy.can_read + [Archiver()]
    can_search = RDMRecordPermissionPolicy.can_search + [Archiver()]
    can_read_files = RDMRecordPermissionPolicy.can_read_files + [Archiver()]
    can_get_content_files = RDMRecordPermissionPolicy.can_get_content_files + [
        Archiver()
    ]
    can_media_get_content_files = RDMRecordPermissionPolicy.can_get_content_files + [
        Archiver()
    ]
    can_read_deleted = [
        IfRecordDeleted(
            then_=[UserManager, SystemProcess()],
            else_=can_read + [Archiver()],
        )
    ]