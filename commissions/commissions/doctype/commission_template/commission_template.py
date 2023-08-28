# -*- coding: utf-8 -*-
# Copyright (c) 2019, Tech Station and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class CommissionTemplate(Document):
	pass

@frappe.whitelist(allow_guest=True)
def getData(customer):
        stock = frappe.db.sql("""select type,beneficiary from `tabCustomer` where customer_name = %s;""",(customer),as_list=1)
        return stock

