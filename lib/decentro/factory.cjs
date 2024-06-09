module.exports = {
	async generateCreditReport({ valid }){
		return (valid) ? {
			'decentroTxnId': '5296XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
			'status': 'SUCCESS',
			'responseCode': 'S00000',
			'message': 'Credit Score fetched successfully',
			'data': {
				'CCRResponse': {
					'Status': '1',
					'CIRReportDataLst': [
						{
							'CIRReportData': {
								'IDAndContactInfo': {
									'PersonalInfo': {
										'Name': {
											'FullName': 'someone full name',
											'FirstName': 'someone first name',
											'MiddleName': 'someone middle name',
											'LastName': 'someone last name '
										},
										'DateOfBirth': 'YYYY-MM-DD',
										'Gender': 'Male',
										'Age': {
											'Age': '35'
										},
										'TotalIncome': '16255'
									},
									'IdentityInfo': {
										'PANId': [
											{
												'seq': '1',
												'ReportedDate': '2018-02-28',
												'IdNumber': 'XXXXXXXXXXX'
											}
										],
										'VoterID': [
											{
												'seq': '1',
												'ReportedDate': '2018-02-28',
												'IdNumber': 'XXXXXXXXXXX'
											}
										],
										'NationalIDCard': [
											{
												'seq': '1',
												'ReportedDate': '2018-02-28',
												'IdNumber': 'XXXXXXXXXXXX'
											}
										]
									},
									'AddressInfo': [
										{
											'Seq': '1',
											'ReportedDate': '2017-12-31',
											'Address': 'N A THEVAR STREET  OLYMBUS COIMBATORE SOUTH COIMBATORE SOUTH DISTRICT',
											'State': 'TN',
											'Postal': '641045',
											'Type': 'Owns'
										},
										{
											'Seq': '2',
											'ReportedDate': '2017-03-31',
											'Address': 'NACHIANNAN ANGANNAN STREET  RAMANATHAPURAM COIMBATORE',
											'State': 'TN',
											'Postal': '641045',
											'Type': 'Rents,Primary'
										},
										{
											'Seq': '3',
											'ReportedDate': '2017-01-31',
											'Address': 'NACHIYANNANAN KANNAN STREET  RAMANATHAPURAM COIMBATORE',
											'State': 'TN',
											'Postal': '641045',
											'Type': 'Primary'
										},
										{
											'Seq': '4',
											'ReportedDate': '2016-09-16',
											'Address': 'NACHIANNAN ANGANNAN STREET  RAMANA THAPURAM RAMANATHAPURAM COIMBATORE',
											'State': 'TN',
											'Postal': '641045'
										},
										{
											'Seq': '5',
											'ReportedDate': '2016-09-16',
											'Address': 'KIKANI EXPORT PVT LTD  104 WEST PERIASAMA Y ROAD  R S PRUAM COIMBATORE',
											'State': 'TN',
											'Postal': '641045'
										}
									],
									'PhoneInfo': [
										{
											'seq': '1',
											'typeCode': 'H',
											'ReportedDate': '2016-04-30',
											'Number': 'XXXXXXXX'
										},
										{
											'seq': '2',
											'typeCode': 'H',
											'ReportedDate': '2016-04-30',
											'Number': 'XXXXXXXX'
										},
										{
											'seq': '3',
											'typeCode': 'M',
											'ReportedDate': '2016-09-16',
											'Number': 'XXXXXXXXXX'
										},
										{
											'seq': '4',
											'typeCode': 'M',
											'ReportedDate': '2018-02-28',
											'Number': 'XXXXXXXXXX'
										},
										{
											'seq': '5',
											'typeCode': 'T',
											'ReportedDate': '2017-01-31',
											'Number': 'XXXXXXXXXX'
										}
									],
									'EmailAddressInfo': [
										{
											'seq': '1',
											'ReportedDate': '2016-09-16',
											'EmailAddress': 'someone@GMAIL.COM'
										}
									]
								},
								'RetailAccountDetails': [
									{
										'seq': '1',
										'AccountNumber': 'XXXXXXXXXXXXX',
										'Institution': 'Sundaram Finance',
										'AccountType': 'Auto Loan',
										'OwnershipType': 'Individual',
										'Balance': '155105',
										'LastPayment': '210000',
										'Open': 'Yes',
										'SanctionAmount': '210000',
										'LastPaymentDate': '2018-02-12',
										'DateReported': '2018-02-28',
										'DateOpened': '2016-07-06',
										'RepaymentTenure': '48',
										'InstallmentAmount': '5540',
										'TermFrequency': 'Monthly',
										'AccountStatus': 'Current Account',
										'source': 'INDIVIDUAL',
										'History48Months': [
											{
												'key': '02-18',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '01-18',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '12-17',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '11-17',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '10-17',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '09-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '08-17',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '07-17',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '06-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '05-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '04-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '03-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '02-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '01-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '12-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '11-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '10-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '09-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '08-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											},
											{
												'key': '07-16',
												'PaymentStatus': 'NEW',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': '*'
											}
										]
									},
									{
										'seq': '2',
										'AccountNumber': 'XXXXXXXXXXXX',
										'Institution': 'Andhra Bank',
										'AccountType': 'Business Loan - Priority Sector- Small Business',
										'OwnershipType': 'Individual',
										'Balance': '30296',
										'PastDueAmount': '0',
										'LastPayment': '1000',
										'Open': 'Yes',
										'SanctionAmount': '45000',
										'LastPaymentDate': '2018-01-05',
										'DateReported': '2018-01-31',
										'DateOpened': '2016-04-30',
										'InterestRate': '8.9',
										'RepaymentTenure': '60',
										'InstallmentAmount': '994',
										'TermFrequency': 'Monthly',
										'CollateralValue': '47000',
										'CollateralType': 'Property',
										'AccountStatus': 'Current Account',
										'AssetClassification': 'Standard',
										'source': 'INDIVIDUAL',
										'History48Months': [
											{
												'key': '01-18',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '12-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '11-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '10-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '09-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '08-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '07-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '06-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '05-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '04-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '03-17',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '02-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '01-17',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '12-16',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '11-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '10-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '09-16',
												'PaymentStatus': '000',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '08-16',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '07-16',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '06-16',
												'PaymentStatus': '30+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '05-16',
												'PaymentStatus': '01+',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											},
											{
												'key': '04-16',
												'PaymentStatus': 'NEW',
												'SuitFiledStatus': '*',
												'AssetClassificationStatus': 'STD'
											}
										]
									}
								],
								'RetailAccountsSummary': {
									'NoOfAccounts': '11',
									'NoOfActiveAccounts': '6',
									'NoOfWriteOffs': '0',
									'TotalPastDue': '2003.00',
									'SingleHighestCredit': '17455.00',
									'SingleHighestSanctionAmount': '210000.00',
									'TotalHighCredit': '17455.00',
									'AverageOpenBalance': '51565.83',
									'SingleHighestBalance': '155105.00',
									'NoOfPastDueAccounts': '1',
									'NoOfZeroBalanceAccounts': '0',
									'RecentAccount': 'Business Loan - Priority Sector- Agriculture on 13-11-2017',
									'OldestAccount': 'Consumer Loan on 06-05-2014',
									'TotalBalanceAmount': '309395.00',
									'TotalSanctionAmount': '356711.00',
									'TotalCreditLimit': '30000.0',
									'TotalMonthlyPaymentAmount': '6534.00'
								},
								'ScoreDetails': [
									{
										'Type': 'ERS',
										'Version': '3.1',
										'Name': 'Equifax Risk Score',
										'Value': '676',
										'ScoringElements': [
											{
												'type': 'RES',
												'seq': '1',
												'Description': 'Number of commercial trades'
											},
											{
												'type': 'RES',
												'seq': '2',
												'code': '7a',
												'Description': 'Delinquency or past due amount occurences'
											},
											{
												'type': 'RES',
												'seq': '3',
												'code': '2f',
												'Description': 'Vintage of trades'
											},
											{
												'type': 'RES',
												'seq': '4',
												'code': '10b',
												'Description': 'Number of business loan trades'
											},
											{
												'type': 'RES',
												'seq': '5',
												'code': '11a',
												'Description': 'Number of or lack of agri loan trades'
											}
										]
									}
								],
								'Enquiries': [
									{
										'seq': '0',
										'Institution': 'Swami Test Company',
										'Date': '2021-06-29',
										'Time': '10:42',
										'RequestPurpose': '00',
										'Amount': '21.6'
									},
									{
										'seq': '1',
										'Institution': 'Swami Test Company',
										'Date': '2021-06-25',
										'Time': '22:37',
										'RequestPurpose': '00',
										'Amount': '21.6'
									}
								],
								'EnquirySummary': {
									'Purpose': 'ALL',
									'Total': '1659',
									'Past30Days': '29',
									'Past12Months': '33',
									'Past24Months': '1189',
									'Recent': '2021-06-29'
								},
								'OtherKeyInd': {
									'AgeOfOldestTrade': '85',
									'NumberOfOpenTrades': '0',
									'AllLinesEVERWritten': '0.00',
									'AllLinesEVERWrittenIn9Months': '0',
									'AllLinesEVERWrittenIn6Months': '0'
								},
								'RecentActivities': {
									'AccountsDeliquent': '0',
									'AccountsOpened': '0',
									'TotalInquiries': '30',
									'AccountsUpdated': '0'
								},
								'DimensionalVariables': {
									'TDA_MESMI_CC_PSDAMT_24': '0.0',
									'TDA_MESME_INS_PSDAMT_24': '0.0',
									'TDA_METSU_CC_PSDAMT_3': '0.0',
									'TDA_SUM_PF_PSDAMT_3': '0.0'
								}
							}
						}
					]
				}
			}
		} : {
			'decentro_txn_id': '5296XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
			'status': 'FAILURE',
			'response_code': 'E00000',
			'message': 'Credit Report API responded with a failure. Please check and try resubmitting.',
			'provider_message': 'Inquiry parameters:ID does not match with credit file'
		};
	}
};