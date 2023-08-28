# -*- coding: utf-8 -*-
# Copyright (c) 2020, Tech Station and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ClosingDriversCommission(Document):
	def on_submit(self):
		for d in self.transaction:
			sv = frappe.get_doc("Sales Order",d.transaction_number)
			sv.is_driver = 1
			sv.save()

		if not self.commission_balance:
			so = frappe.get_doc({
			"doctype": "Commission Balance",
			"type": self.type,
			"beneficiary": self.beneficiary,
			"balance" : self.closing_balance
			})
			so.insert(ignore_permissions=True)
			so.save()
			frappe.msgprint("Commission Balance Created")

		if self.commission_balance:
			doc_or = frappe.get_doc("Commission Balance", self.commission_balance)
			doc_or.balance += self.closing_balance
			doc_or.save()

@frappe.whitelist(allow_guest=True)
def getCB(type,beneficiary):
	mt = frappe.db.sql("""select name from `tabCommission Balance` where type = %s and beneficiary = %s;""",(type,beneficiary))
	return mt[0][0] if mt else ""


@frappe.whitelist(allow_guest=True)
def insert_data(from_date,to_date,beneficiary):
	query="select payment_method,transaction_date,name,grand_total,owner from `tabSales Order` where status = 'Completed' and is_driver = 0 and car_drivers = '"+str(beneficiary)+"' and transaction_date between '"+str(from_date)+"' and '"+str(to_date)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:
		payment_method,transaction_date,name,grand_total,owner = i["payment_method"],i["transaction_date"],i["name"],i["grand_total"],i["owner"]
		li.append([payment_method,transaction_date,name,grand_total,owner])
	return li


@frappe.whitelist(allow_guest=True)
def getCODorder(beneficiary,from_date,to_date):
	mt = frappe.db.sql("""select count(name) from `tabSales Order` where is_driver = 0 and docstatus = 1 and 
			status = "Completed" 
			and car_drivers = %s and transaction_date between %s and %s;""",(beneficiary,from_date,to_date),as_list=1)
	return mt[0][0] if mt else 0.0

@frappe.whitelist(allow_guest=True)
def getDELDC(beneficiary):
	mt = frappe.db.sql("""select driver_commission from `tabCar Drivers` where name = %s;""",(beneficiary),as_list=1)
	return mt[0][0] if mt else 0.0
