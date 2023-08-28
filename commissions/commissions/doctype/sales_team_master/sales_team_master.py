# -*- coding: utf-8 -*-
# Copyright (c) 2019, Tech Station and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import msgprint
from frappe.model.document import Document

class SalesTeamMaster(Document):
	def after_insert(self):
                so = frappe.get_doc({
       	        "doctype": "Commission Balance",
               	"type": self.doctype,
               	"beneficiary": self.name,
		"sales_team": self.employee
               	})
               	so.insert(ignore_permissions=True)
               	so.save()
               	frappe.msgprint("Commission Balance Created For Sales Team")
