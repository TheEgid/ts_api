import argparse
import logging
import json
from utils import pdf_process, get_file_content


class DisableLogger:
    def __enter__(self):
        logging.disable(logging.CRITICAL)
        logging.disable(logging.INFO)
        logging.disable(logging.WARNING)

    def __exit__(self, exit_type, exit_value, exit_traceback):
        logging.disable(logging.NOTSET)


def get_args_parser():
    formatter_class = argparse.ArgumentDefaultsHelpFormatter
    parser = argparse.ArgumentParser(formatter_class=formatter_class)
    parser.add_argument(
        '--pdf_filepath',
        type=str,
    )
    return parser


def file_processor(pdf_filepath):
    with DisableLogger():
        try:
            docx_path = pdf_process(in_filepath=pdf_filepath)
            file_content = get_file_content(docx_path)
            dict_out = json.dumps({
                'docxPath': docx_path,
                'fileContent': file_content
            })
            return dict_out
        except FileNotFoundError:
            return json.dumps({
                'docxPath': 'Error',
                'fileContent': 'Error'
            })


if __name__ == '__main__':
     args = get_args_parser().parse_args()
     document = file_processor(args.pdf_filepath)
     print(document)
