# -*- coding: utf-8 -*-
# Copyright (c) 2019, Tech Station and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PayingCommissionBalance(Document):
	def on_submit(doc):
		doc.created_by = doc.owner
		doc.confirmed_by = frappe.session.user
		if not doc.type == "Sales Team Master":
			doc_or = frappe.get_doc("Commission Balance", doc.commission_balance)
			doc_or.balance -= doc.amount
			doc_or.save()

		if doc.type == "Sales Team Master":
			doc_pr = frappe.get_doc("Commission Balance", doc.cb)
			doc_pr.balance -= doc.amount
			doc_pr.save()
			doc_or = frappe.get_doc("Balance Detail", doc.commission_balance)
			doc_or.paid += doc.amount
			doc_or.balance = doc_or.total_commission - doc_or.paid
			doc_or.save()

		gl_entry = frappe.get_doc({
		"doctype": "GL Entry",
		"posting_date": doc.date,
		"party": doc.beneficiary,
		"voucher_type":"Paying Commission Balance",
		"party_type":doc.type,
		"voucher_no":doc.name,
		"account":doc.account_paid_to,
		"debit":doc.amount,
		"debit_in_account_currency":doc.amount
		})
		gl_entry.insert(ignore_permissions=True)
		gl_entry.submit()


		gl_entry = frappe.get_doc({
		"doctype": "GL Entry",
		"posting_date": doc.date,
		"party": doc.beneficiary,
		"voucher_type":"Paying Commission Balance",
		"party_type":doc.type,
		"voucher_no":doc.name,
		"account":doc.account_paid_from,
		"credit":doc.amount,
		"credit_in_account_currency":doc.amount 
		})
		gl_entry.insert(ignore_permissions=True)
		gl_entry.submit()


@frappe.whitelist(allow_guest=True)
def getBalance(type,beneficiary):
	mt = frappe.db.sql("""select name,balance from `tabCommission Balance` where type = %s and beneficiary = %s;""",(type,beneficiary),as_list=1)
	return mt


@frappe.whitelist(allow_guest=True)
def getBalanceST(type,beneficiary,employee):
	mt = frappe.db.sql("""select bd.parent,bd.name,bd.balance from `tabCommission Balance` cb, `tabBalance Detail` bd
				where bd.parent = cb.name and cb.type = %s and cb.beneficiary = %s and bd.employee = %s;""",(type,beneficiary,employee),as_list=1)
	return mt
